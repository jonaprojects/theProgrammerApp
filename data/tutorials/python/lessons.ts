import { PythonLessonContent } from "@/components/tutorials/PythonLessonPage";

export const pythonLessons = {
  Elif: {
    title: "התניות elif",
    intro: [
      "כאשר יש יותר משתי אפשרויות, elif מאפשרת לבדוק תנאים נוספים לפי הסדר. פייתון מבצע רק את הבלוק הראשון שהתנאי שלו מתקיים.",
    ],
    sections: [
      {
        title: "שרשרת תנאים",
        paragraphs: ["בדוגמה הבאה נקבל ציון ונבחר הודעה אחת. שימו לב להזחה ולנקודתיים בסוף כל תנאי."],
        code: `grade = int(input("Enter your grade: "))

if grade >= 90:
    print("Excellent")
elif grade >= 70:
    print("Good")
elif grade >= 55:
    print("Passed")
else:
    print("Try again")`,
      },
      {
        title: "הסדר חשוב",
        paragraphs: ["התנאים נבדקים מלמעלה למטה. לכן מתחילים במקרה המצומצם או הגבוה ביותר; אילו בדקנו grade >= 55 ראשון, גם ציון 95 היה נעצר שם."],
      },
      {
        title: "תנאים משולבים",
        paragraphs: ["אפשר לשלב and, or ו-not כדי לתאר כלל מדויק יותר."],
        code: `age = 20
has_ticket = True

if age >= 18 and has_ticket:
    print("Welcome!")
elif not has_ticket:
    print("A ticket is required")
else:
    print("Entry is not allowed")`,
      },
    ],
    next: { title: "לולאות", path: "/tutorials/python/Loops" },
  },
  Loops: {
    title: "לולאות for ו־while",
    intro: ["לולאות מקצרות פעולות שחוזרות על עצמן. במקום לכתוב אותה פקודה עשרות פעמים, מגדירים פעם אחת מה לבצע ועל אילו ערכים."],
    sections: [
      { title: "לולאת for", paragraphs: ["for עוברת על איברי אוסף, למשל רשימה, מחרוזת או טווח מספרים."], code: `for number in range(1, 6):
    print(number)

languages = ["Python", "JavaScript", "Java"]
for language in languages:
    print(f"I am learning {language}")` },
      { title: "לולאת while", paragraphs: ["while חוזרת כל עוד התנאי שלה הוא True. חשוב לעדכן בתוך הלולאה את המשתנה שמשפיע על התנאי, אחרת תיווצר לולאה אינסופית."], code: `counter = 3

while counter > 0:
    print(counter)
    counter -= 1

print("Go!")` },
      { title: "דוגמה שימושית", paragraphs: ["נקלוט מחירים עד שהמשתמש יזין ‎-1. ערך מיוחד שמסיים את הקלט נקרא sentinel."], code: `total_price = 0
current_price = float(input("Enter a price (-1 to finish): "))

while current_price != -1:
    total_price += current_price
    current_price = float(input("Enter a price (-1 to finish): "))

print(f"Total: {total_price}")` },
    ],
    next: { title: "פונקציות", path: "/tutorials/python/Functions" },
  },
  Functions: {
    title: "פונקציות",
    intro: ["פונקציה היא יחידת קוד בעלת שם שמבצעת משימה מוגדרת. פונקציות עוזרות למנוע כפילות, לפרק בעיה לחלקים ולבדוק כל חלק בנפרד."],
    sections: [
      { title: "הגדרה וקריאה", paragraphs: ["מגדירים פונקציה בעזרת def וקוראים לה באמצעות שמה וסוגריים."], code: `def greet():
    print("Hello!")

greet()` },
      { title: "פרמטרים", paragraphs: ["פרמטרים הם הערכים שהפונקציה מקבלת. אפשר לספק ערכי ברירת מחדל ולקרוא לפרמטרים בשמם."], code: `def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Dana")
greet(name="Noam", greeting="Welcome")` },
      { title: "החזרת ערך", paragraphs: ["return מחזירה תוצאה לקוד שקרא לפונקציה ומסיימת את ריצתה."], code: `def rectangle_area(width, height):
    if width < 0 or height < 0:
        return 0
    return width * height

area = rectangle_area(5, 3)
print(area)  # 15` },
    ],
    next: { title: "רשימות", path: "/tutorials/python/Lists" },
  },
  Lists: {
    title: "רשימות",
    intro: ["רשימה (list) היא אוסף מסודר וניתן לשינוי. האיברים יכולים להיות מטיפוסים שונים, ולכל איבר אינדקס שמתחיל ב־0."],
    sections: [
      { title: "יצירה וגישה לאיברים", paragraphs: ["אינדקס חיובי סופר מההתחלה; אינדקס שלילי סופר מהסוף."], code: `numbers = [1, 6, 3, 2]

print(numbers[0])   # 1
print(numbers[2])   # 3
print(numbers[-1])  # 2` },
      { title: "הוספת איברים", paragraphs: ["append מוסיפה איבר יחיד לסוף הרשימה. extend מוסיפה את כל האיברים מאוסף אחר."], code: `numbers = [2, 6, 9]
numbers.append(3)
print(numbers)  # [2, 6, 9, 3]

numbers.extend([4, 5])
print(numbers)  # [2, 6, 9, 3, 4, 5]` },
      { title: "הסרת איברים", paragraphs: ["remove מסירה לפי ערך, pop מסירה ומחזירה לפי אינדקס, del מוחקת מיקום ו-clear מרוקנת את הרשימה."], code: `animals = ["monkey", "lion", "dog", "cat"]
animals.remove("lion")
last_animal = animals.pop()
del animals[0]

print(animals)      # ["dog"]
print(last_animal)  # cat
animals.clear()` },
      { title: "מיון", paragraphs: ["sort משנה את הרשימה עצמה. sorted מחזירה רשימה חדשה ומשאירה את המקור ללא שינוי."], code: `numbers = [1, 3, 2, 5, 4]
numbers.sort()
print(numbers)  # [1, 2, 3, 4, 5]

descending = sorted(numbers, reverse=True)` },
    ],
    next: { title: "מחרוזות", path: "/tutorials/python/Strings" },
  },
  Strings: {
    title: "מחרוזות (strings)",
    intro: ["מחרוזת היא רצף תווים. כותבים אותה בין מרכאות, ניגשים לתווים בעזרת אינדקסים ויכולים לעבור עליה בלולאה."],
    sections: [
      { title: "אינדקסים ואורך", code: `greeting = "hello"

print(greeting[0])   # h
print(greeting[-1])  # o
print(len(greeting)) # 5

for character in greeting:
    print(character)` },
      { title: "פעולות שימושיות", paragraphs: ["פעולות על מחרוזות מחזירות מחרוזת חדשה; הן אינן משנות את המקור."], code: `sentence = "My name is John"

words = sentence.split(" ")
updated = sentence.replace("John", "Dana")

print(sentence.upper())
print(sentence.lower())
print(sentence.count("n"))
print(sentence.find("is"))` },
      { title: "חיתוך מחרוזת", paragraphs: ["התחביר start:end מחזיר את התווים מההתחלה ועד לפני אינדקס הסיום."], code: `language = "Python"

print(language[0:3])  # Pyt
print(language[2:])   # thon
print(language[::-1]) # nohtyP` },
    ],
    next: { title: "Tuples", path: "/tutorials/python/Tuples" },
  },
  Tuples: {
    title: "Tuples",
    intro: ["Tuple הוא אוסף מסודר שאי אפשר לשנות לאחר יצירתו. הוא מתאים לערכים שצריכים להישאר קבועים, כמו נקודה במרחב או צבע RGB."],
    sections: [
      { title: "יצירה וגישה", code: `point = (10, 20)
print(point[0])  # 10

single_item = (5,)  # הפסיק הכרחי
empty_tuple = ()` },
      { title: "פירוק ערכים", paragraphs: ["אפשר לשייך את איברי ה־tuple למספר משתנים בפעולה אחת."], code: `person = ("Dana", 24, "Haifa")
name, age, city = person

print(name)
print(age)
print(city)` },
      { title: "מה כן אפשר לעשות?", paragraphs: ["אי אפשר להחליף איבר, אך אפשר לקרוא, לחתוך, לספור ולחפש אינדקס."], code: `colors = ("red", "blue", "red", "green")

print(colors.count("red"))  # 2
print(colors.index("blue")) # 1
print(colors[1:3])           # ("blue", "red")` },
    ],
    next: { title: "Sets", path: "/tutorials/python/Sets" },
  },
  Sets: {
    title: "Sets",
    intro: ["Set הוא אוסף לא מסודר של ערכים ייחודיים. הוא שימושי להסרת כפילויות ולבדיקות חברות מהירות."],
    sections: [
      { title: "יצירה ועדכון", code: `numbers = {1, 2, 2, 3}
print(numbers)  # {1, 2, 3}

numbers.add(4)
numbers.discard(2)  # לא נכשל אם הערך חסר
print(3 in numbers) # True` },
      { title: "פעולות בין קבוצות", paragraphs: ["איחוד מחבר ערכים; חיתוך משאיר משותפים; הפרש משאיר את הערכים שנמצאים רק בקבוצה הראשונה."], code: `python_students = {"Dana", "Noam", "Roni"}
web_students = {"Noam", "Roni", "Amit"}

print(python_students | web_students) # union
print(python_students & web_students) # intersection
print(python_students - web_students) # difference` },
      { title: "הסרת כפילויות", code: `names = ["Dana", "Noam", "Dana", "Roni"]
unique_names = list(set(names))
print(unique_names)` },
    ],
    next: { title: "מילון (dict)", path: "/tutorials/python/Dicts" },
  },
  Dicts: {
    title: "מילונים (dict)",
    intro: ["מילון שומר זוגות של מפתח וערך. כל מפתח ייחודי, ובעזרתו ניגשים לערך המתאים בלי לחפש לפי מיקום."],
    sections: [
      { title: "יצירה, קריאה ועדכון", code: `student = {
    "name": "Dana",
    "age": 24,
    "course": "Python"
}

print(student["name"])
student["age"] = 25
student["city"] = "Haifa"` },
      { title: "גישה בטוחה", paragraphs: ["גישה למפתח חסר באמצעות סוגריים תגרום לשגיאה. get מחזירה None או ערך ברירת מחדל."], code: `print(student.get("grade"))       # None
print(student.get("grade", "N/A")) # N/A

if "course" in student:
    print(student["course"])` },
      { title: "מעבר על מילון", code: `for key, value in student.items():
    print(f"{key}: {value}")

for key in student.keys():
    print(key)

for value in student.values():
    print(value)` },
      { title: "מחיקה", code: `removed_age = student.pop("age")
del student["city"]
print(removed_age)

student.clear()` },
    ],
    next: { title: "תכנות מונחה עצמים", path: "/tutorials/python/OOP_Intro" },
  },
  OOP_Intro: {
    title: "מחלקות ואובייקטים",
    intro: ["תכנות מונחה עצמים מאפשר לתאר ישויות באמצעות מחלקות. מחלקה היא תבנית שמגדירה נתונים והתנהגות; אובייקט הוא מופע מסוים שנוצר ממנה."],
    sections: [
      { title: "מחלקה ובנאי", paragraphs: ["הפעולה __init__ נקראת בזמן יצירת אובייקט. הפרמטר self מתייחס לאובייקט הנוכחי."], code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

romi = Person("Romi", 26)
print(romi.name)` },
      { title: "פעולות של אובייקט", paragraphs: ["פעולה שמוגדרת במחלקה מקבלת self ויכולה להשתמש בתכונות האובייקט."], code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def hello(self):
        print(f"Hello, I am {self.name} and I am {self.age}")

romi = Person("Romi", 26)
romi.hello()` },
      { title: "כל אובייקט עצמאי", code: `dana = Person("Dana", 22)
noam = Person("Noam", 30)

dana.age = 23
print(dana.age) # 23
print(noam.age) # 30` },
    ],
    next: { title: "הפעולה __str__", path: "/tutorials/python/ToString" },
  },
  ToString: {
    title: "הפעולה __str__",
    intro: ["כאשר מדפיסים אובייקט, פייתון זקוקה לייצוג טקסטואלי שלו. הפעולה המיוחדת __str__ מאפשרת למחלקה להחליט איזה טקסט יוחזר."],
    sections: [
      { title: "לפני שמגדירים __str__", code: `romi = Person("Romi", 26)
print(romi)
# <__main__.Person object at 0x...>` },
      { title: "ייצוג קריא", paragraphs: ["__str__ חייבת להחזיר מחרוזת. print ו-str ישתמשו בה אוטומטית."], code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def __str__(self):
        return f"My name is {self.name} and I am {self.age}"

romi = Person("Romi", 26)
print(romi)
# My name is Romi and I am 26` },
    ],
    next: { title: "כימוס", path: "/tutorials/python/Encapsulation" },
  },
  Encapsulation: {
    title: "כימוס",
    intro: ["כימוס (Encapsulation) מרכז את הנתונים ואת הפעולות שמותר לבצע עליהם בתוך המחלקה. כך אפשר למנוע מצב לא תקין ולשנות את המימוש בלי לשבור קוד חיצוני."],
    sections: [
      { title: "תכונות פרטיות", paragraphs: ["בפייתון שני קווים תחתונים מפעילים name mangling ומונעים גישה מקרית מבחוץ."], code: `class Person:
    def __init__(self, name, age):
        self.__name = name
        self.__age = age

romi = Person("Romi", 26)
# print(romi.__age)  # AttributeError` },
      { title: "Getters ו־setters", paragraphs: ["פעולות גישה מאפשרות לקרוא נתון ולעדכן אותו רק לאחר בדיקה."], code: `class Person:
    def __init__(self, name, age):
        self.__name = name
        self.__age = age

    def get_age(self):
        return self.__age

    def set_age(self, age):
        if age >= 0:
            self.__age = age
        else:
            print("Invalid age")

romi = Person("Romi", 26)
romi.set_age(-1)      # Invalid age
print(romi.get_age()) # 26` },
      { title: "Properties — הדרך הפייתונית", code: `class Person:
    def __init__(self, age):
        self.age = age

    @property
    def age(self):
        return self.__age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("Age cannot be negative")
        self.__age = value` },
    ],
    next: { title: "ירושה", path: "/tutorials/python/Inheritance" },
  },
  Inheritance: {
    title: "ירושה",
    intro: ["ירושה מאפשרת למחלקה חדשה לקבל תכונות ופעולות ממחלקת בסיס. כך משתפים קוד ומבטאים קשר של 'הוא סוג של'."],
    sections: [
      { title: "מחלקת אב ומחלקת בת", paragraphs: ["Student יורשת מ־Person. בעזרת super קוראים לבנאי של מחלקת האב."], code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Student(Person):
    def __init__(self, name, age, grade_average):
        super().__init__(name, age)
        self.grade_average = grade_average

student = Student("Romi", 22, 87.2)
print(student.name)` },
      { title: "בדיקת סוג", code: `print(isinstance(student, Student)) # True
print(isinstance(student, Person))  # True
print(isinstance(student, int))     # False` },
      { title: "דריסת פעולה", paragraphs: ["מחלקת בת יכולה להגדיר פעולה באותו שם ולהתאים את ההתנהגות שלה."], code: `class Student(Person):
    def describe(self):
        return f"{self.name}, average: {self.grade_average}"` },
    ],
    next: { title: "פעולות סטטיות", path: "/tutorials/python/StaticMethods" },
  },
  StaticMethods: {
    title: "פעולות סטטיות",
    intro: ["רוב פעולות המחלקה מקבלות self ופועלות על אובייקט מסוים. פעולה סטטית שייכת לנושא של המחלקה, אך אינה זקוקה למצב של אובייקט."],
    sections: [
      { title: "פעולת מופע", paragraphs: ["פעולת מופע מקבלת self. כאשר קוראים לה דרך אובייקט, פייתון מעבירה את האובייקט אוטומטית."], code: `class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        print(f"{self.name}: Woof!")

rexi = Dog("Rexi")
rexi.bark()` },
      { title: "staticmethod ו־classmethod", paragraphs: ["staticmethod לא מקבלת self. classmethod מקבלת cls ומתאימה לבנאים חלופיים או לפעולה שתלויה במחלקה עצמה."], code: `class Temperature:
    @staticmethod
    def celsius_to_fahrenheit(celsius):
        return celsius * 9 / 5 + 32

    @classmethod
    def freezing_point(cls):
        return cls(0)

print(Temperature.celsius_to_fahrenheit(20))` },
      { title: "מחלקת שירות", code: `class StringUtils:
    @staticmethod
    def reverse(text):
        return text[::-1]

    @staticmethod
    def count_vowels(text):
        vowels = "aeiou"
        return sum(char.lower() in vowels for char in text)

print(StringUtils.reverse("Hello"))
print(StringUtils.count_vowels("Hello World"))` },
    ],
    next: { title: "ירושה וכימוס", path: "/tutorials/python/InheritanceAndEncapsulation" },
  },
  InheritanceAndEncapsulation: {
    title: "ירושה וכימוס",
    intro: ["בירושה נרצה לעיתים שמחלקת הבת תשתמש בתכונות של מחלקת האב, בלי לחשוף אותן לכל הקוד. מוסכמת protected — קו תחתון יחיד — מסמנת שתכונה מיועדת למחלקה וליורשותיה."],
    sections: [
      { title: "תכונות מוגנות", paragraphs: ["פייתון אינה אוכפת protected; זו מוסכמה שמבקשת מקוד חיצוני לא לגשת ישירות לתכונה."], code: `class Person:
    def __init__(self, name, age):
        self._name = name
        self._age = age

    def set_age(self, age):
        if age < 0:
            raise ValueError("Invalid age")
        self._age = age` },
      { title: "גישה ממחלקת בת", code: `class Student(Person):
    def __init__(self, name, age, average):
        super().__init__(name, age)
        self._average = average

    def __str__(self):
        return (
            f"Student: {self._name}, "
            f"age {self._age}, average {self._average}"
        )

student = Student("Dana", 21, 92)
print(student)` },
      { title: "בחירה נכונה", paragraphs: ["השתמשו בתכונה ציבורית כשאין צורך להגביל אותה, ב־protected לשיתוף מכוון עם יורשות, ובתכונה פרטית כשפרטי המימוש צריכים להישאר בתוך המחלקה."],
      },
    ],
    next: { title: "ספריות חיצוניות", path: "/tutorials/python/ExternalLibraries" },
  },
  ExternalLibraries: {
    title: "ספריות חיצוניות",
    intro: ["ספרייה חיצונית היא קוד שמפתח אחר ארז לשימוש חוזר. מתקינים חבילות מהמאגר PyPI בעזרת pip, ואז מייבאים אותן לתוכנית."],
    sections: [
      { title: "התקנה וייבוא", paragraphs: ["את פקודת ההתקנה מריצים בטרמינל, לא בתוך קובץ Python. כדאי לעבוד בסביבה וירטואלית לכל פרויקט."], code: `# Terminal
python -m pip install matplotlib

# Python file
import matplotlib.pyplot as plt`, language: "bash" },
      { title: "ציור גרף עם matplotlib", code: `import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [-2, 7, 3, 6, 9]

plt.plot(x, y, marker="o")
plt.xlabel("X axis")
plt.ylabel("Y axis")
plt.title("Simple Graph")
plt.show()` },
      { title: "ספריות נפוצות", paragraphs: ["NumPy משמשת לחישובים ומערכים, pandas לניתוח נתונים, Django ו־Flask ליישומי Web, Beautiful Soup לעיבוד HTML ו־requests לבקשות HTTP."], code: `import requests

response = requests.get(
    "https://api.example.com/items",
    timeout=10,
)
response.raise_for_status()
items = response.json()` },
      { title: "עבודה אחראית", paragraphs: ["קראו את התיעוד, בדקו שהספרייה מתוחזקת, וקבעו גרסאות בקובץ requirements.txt כדי שהפרויקט יהיה ניתן לשחזור."], code: `# requirements.txt
matplotlib==3.9.2
requests==2.32.3`, language: "text" },
    ],
  },
} satisfies Record<string, PythonLessonContent>;

export type PythonLessonKey = keyof typeof pythonLessons;
