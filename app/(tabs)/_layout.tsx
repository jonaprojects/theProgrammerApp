import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";

export default function Layout() {
  // const colorScheme = useColorScheme();
  //TODO: revert this later!
  const colorScheme = "dark";

  const tabs = (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        tabBarInactiveTintColor: "gray",
        tabBarLabelPosition: "below-icon",
        tabBarLabelStyle: {
          fontFamily: "Heebo_500Medium",
          fontSize: 12,
          lineHeight: 16,
          writingDirection: "rtl",
        },
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "dark"].tabBackgroundColor,
          borderTopColor: "transparent",
          height: 64,
          paddingTop: 6,
          paddingBottom: 6,
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
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
        name="exercises"
        options={{
          title: "תרגול",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "קורסים",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "search-outline" : "search-outline"}
              color={color}
            />
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

  // return <NewQuestions />;
  return tabs;
}
