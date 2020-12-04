import React from 'react'
import { PixiComponent, Container as PIXIReactContainer } from '@inlet/react-pixi'
import * as PIXI from 'pixi.js'
import { dragTrack } from '@core/utils/events'
import {
  applyDefaultProps, preprocessProps,
} from '@utils'
import {
  PIXIFlexStyle, PIXIBasicStyle, PIXIDisplayObjectProps,
} from '@type'
import { Position } from 'unitx-ui/type'

export type ContainerProps = PIXIDisplayObjectProps
& React.ComponentProps<typeof PIXIReactContainer> &{
  style: PIXIFlexStyle & PIXIBasicStyle;
  children: React.ReactNode;
  draggable?: boolean;
  onDrag?: (param: Position) => void;
}

// export type Container = PIXI.Container & {
//   flex: boolean;
//   yoga: YogaLayout;
// }

const Container = PixiComponent<ContainerProps, PIXI.Container>('PIXIContainer', {
  create: (props) => {
    const {
      onDrag,
      draggable = false,
      interactive = false,
    } = props
    const instance = new PIXI.Container()
    instance.interactive = interactive || draggable
    if (draggable) {
      const { onDown, onMove } = dragTrack((posDiff) => {
        const { parent: { scale } } = instance
        instance.x += posDiff.x / scale.x
        instance.y += posDiff.y / scale.y
        onDrag && onDrag({ x: instance.x, y: instance.y })
      })
      instance
        .on('mousedown', (e: PIXI.InteractionEvent) => {
          const { originalEvent } = e.data
          // @ts-ignore
          const { x, y } = originalEvent
          onDown({ x, y })
        })
        .on('mousemove', (e: PIXI.InteractionEvent) => {
          const { originalEvent } = e.data
          // @ts-ignore
          const { x, y } = originalEvent
          onMove({ x, y })
        })
    }
    // applyEvents(instance, props)
    return instance
  },
  applyProps: (mutableInstance: PIXI.Container, oldProps, _props) => {
    const props = preprocessProps(_props)
    const {
      left = 0,
      top = 0,
      width,
      height,
    } = props.style ?? {}
    applyDefaultProps(
      mutableInstance,
      oldProps,
      props,
      {
        isFlex: false,
      },
    )
    mutableInstance.x = left
    mutableInstance.y = top
    width && (mutableInstance.width = width)
    height && (mutableInstance.height = height)
  },
})

export default Container

// wrapComponent<FlexContainerProps>(
//   FlexContainer,
// )
