const mockValues = new Map<string, string>();
let mockConnected = true;

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(async (key: string) => mockValues.get(key) ?? null),
  setItem: jest.fn(async (key: string, value: string) => { mockValues.set(key, value); }),
  removeItem: jest.fn(async (key: string) => { mockValues.delete(key); }),
  multiRemove: jest.fn(async (keys: string[]) => { keys.forEach((key) => mockValues.delete(key)); }),
}));

jest.mock("@react-native-community/netinfo", () => ({
  __esModule: true,
  default: {
    fetch: jest.fn(async () => ({ isConnected: mockConnected, isInternetReachable: mockConnected })),
    addEventListener: jest.fn(() => () => undefined),
  },
}));

jest.mock("../api/client", () => ({
  API_BASE_URL: "http://offline-test/api/v1",
  ApiRequestError: Error,
  api: {
    listCourses: jest.fn(),
    getCourse: jest.fn(),
    getProgress: jest.fn(),
    updateLessonProgress: jest.fn(),
  },
}));

import type { ApiProgress } from "@/services/api/types";
import { offlineLearning } from "./learning";

const mockedApi = jest.requireMock("../api/client").api as {
  listCourses: jest.Mock;
  getCourse: jest.Mock;
  getProgress: jest.Mock;
  updateLessonProgress: jest.Mock;
};

const progress = {
  summary: { completedLessons: 0, completedCourses: 0, lastActivityAt: null },
  enrollments: [{
    courseSlug: "html-basics",
    completedLessons: 0,
    totalLessons: 1,
    completionPercentage: 0,
    status: "not_started",
    completedAt: null,
    lastAccessedAt: null,
    resumeLesson: null,
    lessons: [{ lessonSlug: "intro", lessonTitle: "Intro", position: 1, status: "not_started", completedAt: null, lastAccessedAt: null }],
  }],
} as unknown as ApiProgress;

describe("offline learning storage", () => {
  beforeEach(() => {
    mockValues.clear();
    mockConnected = true;
    jest.clearAllMocks();
  });

  it("returns cached catalog data when the device goes offline", async () => {
    mockedApi.listCourses.mockResolvedValue([{ id: "course-1", slug: "html-basics" }]);
    expect((await offlineLearning.listCourses()).source).toBe("network");

    mockConnected = false;
    const cached = await offlineLearning.listCourses();

    expect(cached.source).toBe("cache");
    expect(cached.data[0]?.slug).toBe("html-basics");
    expect(mockedApi.listCourses).toHaveBeenCalledTimes(1);
  });

  it("queues completion offline and flushes it after reconnecting", async () => {
    mockedApi.getProgress.mockResolvedValue(progress);
    await offlineLearning.getProgress("user-1");
    mockConnected = false;

    const result = await offlineLearning.recordLessonProgress(
      "user-1", "html-basics", "intro", "completed",
    );

    expect(result.queued).toBe(true);
    expect(result.progress?.enrollments[0]?.lessons[0]?.status).toBe("completed");
    expect(await offlineLearning.pendingLessonProgressCount("user-1")).toBe(1);

    mockConnected = true;
    mockedApi.updateLessonProgress.mockResolvedValue(undefined);
    expect(await offlineLearning.flushLessonProgress("user-1")).toBe(1);
    expect(await offlineLearning.pendingLessonProgressCount("user-1")).toBe(0);
    expect(mockedApi.updateLessonProgress).toHaveBeenCalledWith(
      "html-basics", "intro", "completed",
    );
  });
});
