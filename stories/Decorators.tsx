import { Stage } from '@inlet/react-pixi'
import React from 'react'
import { useMeasure, View } from 'colay-ui'
// @ts-ignore
import { Story as StoryType } from '@storybook/react/types-6-0'
import * as C from 'colay/color'
import '../src/core/config'

export const StageDecorator = (props) => {
  const [ref, {width, height,}] = useMeasure()
  return (
    <View
      ref={ref}
      style={{ width: '70%', height: 200 }}
    >
      <Stage
        options={{
          width,
          height,
          resolution: 1,
          antialias: true,
          autoDensity: true,
          backgroundColor: C.rgbNumber('white'),
        }}
      >
          {props.children}
      </Stage>
    </View>
  )
}

// export const createTemplate = <T,>(
//   Component: ComponentType<T>,
// ): StoryType<T> => (args: T) => (
//   <Component
//     {...args}
//   />
//   )