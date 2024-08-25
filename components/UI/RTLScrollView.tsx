import React, { forwardRef, useEffect, useRef } from "react";
import { ScrollView, ScrollViewProps } from "react-native";

const RTLScrollView = forwardRef(function RTLScrollView(
  props: ScrollViewProps,
  ref
) {
  const scrollViewRef = useRef<ScrollView>();

  useEffect(() => {
    // Automatically scroll to the end (right) when the component mounts
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, []);

  return (
    <ScrollView
      style={{ flexDirection: "row" }}
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      ref={scrollViewRef}
    >
      {props.children}
    </ScrollView>
  );
});

export default RTLScrollView;
