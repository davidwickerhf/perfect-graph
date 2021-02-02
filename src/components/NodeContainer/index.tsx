import React from 'react'
import { wrapComponent } from 'colay-ui'
import { useNode } from '@hooks'
import { RenderNode, NodeConfig } from '@type'
import { calculateObjectBoundsWithoutChildren } from '@utils'
import { Container } from '../Container'

export type NodeContainerProps = {
  children: RenderNode;
  item: any;
  graphID: string;
  config?: NodeConfig;
}

export type NodeContainerType = React.ForwardedRef<NodeContainerProps>

const NodeContainerElement = (
  props: NodeContainerProps,
  __: React.ForwardedRef<NodeContainerType>,
) => {
  const {
    item,
    graphID,
    children,
    config = {} as NodeConfig,
  } = props
  const containerRef = React.useRef(null)
  const { element, context, cy } = useNode({
    id: item.id,
    graphID,
    config,
    position: config.position ?? item.position ?? { x: 0, y: 0 },
    onPositionChange: ({ element }) => {
      const { x, y } = element.position()
      // @ts-ignore
      containerRef.current.x = x
      // @ts-ignore
      containerRef.current.y = y
      context.boundingBox.x = x
      context.boundingBox.y = y
    },
  })
  const { x, y } = element.position()
  const onDrag = React.useCallback(
    (pos) => {
      element.position(pos)
    },
    [element],
  )
  React.useEffect(() => {
    // @ts-ignore
    context.boundingBox = calculateObjectBoundsWithoutChildren(
      containerRef.current,
    )
  })
  return (
    <Container
      ref={containerRef}
      style={{
        left: x,
        top: y,
      }}
      draggable
      onDrag={onDrag}
      // onRightPress={(event) => {
      //   console.log('rightPress')
      //   event.data.originalEvent.preventDefault()
      //   event.data.originalEvent.stopPropagation()
      // }}
      // onPress={(e) => console.log('press')}
    >
      {children({ item, element, cy })}
    </Container>
  )
}

export const NodeContainer = wrapComponent<NodeContainerProps>(
  NodeContainerElement,
  {
    isForwardRef: true,
  },
)
