import { Tabs, useNavigation, Stack } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

// Boarding screens
import NewQuestions from "../onboarding/new_questions";
import OurYoutube from "../onboarding/our_youtube";
import WeHaveTutorials from "../onboarding/tutorials";

export default function Layout() {
  // const colorScheme = useColorScheme();
  //TODO: revert this later!
  const colorScheme = "dark";

  const tabs = (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 14 },
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "dark"].tabBackgroundColor,
          borderTopColor: "transparent",
          elevation: 0,
        },
        tabBarIconStyle: { fontSize: 20 },
        headerShown: false, // hide header if needed
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "בית",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exercise"
        options={{
          title: "תרגול",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),
        }}
      />{" "}
      <Tabs.Screen
        name="courses"
        options={{
          title: "קורסים",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "search-outline" : "search-outline"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my_courses"
        options={{
          title: "הקורסים שלי",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "book-outline" : "book-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
  return tabs;
}
