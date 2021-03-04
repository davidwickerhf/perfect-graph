import React from 'react'
import { LayoutChangeEvent } from 'react-native'
import { EdgeSingular, NodeSingular, Core } from 'cytoscape'
import { Position, Enumerable } from 'colay/type'
import { Theme } from '@core/theme'
import {
  ELEMENT_TYPE,
  EVENT,
  DATA_TYPE,
  EDITOR_MODE,
  PIXI_EVENT_NAMES,
  CYTOSCAPE_EVENT,
} from '@utils/constants'
import { Viewport } from 'pixi-viewport'
import { ViewportProps } from '@components/Viewport'
import * as PIXI from 'pixi.js'
import { YogaConstants } from '@utils/addFlexLayout/flex-layout/YogaContants'
import { YogaLayout } from '@utils/addFlexLayout/flex-layout/YogaLayout'
import GraphLayouts from '@core/layouts'
import type * as PIXIType from './pixi'

export type Style = {[k: string]: any}
export type OnLayout = (event: LayoutChangeEvent) => void
export type ElementContext = {
  render: (callback?: () => void) => void;
}

export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
}
export type EdgeElementSettings = {
  filtered: boolean;
  nodeFiltered: boolean;
  visibility: {
    nodeVisible: boolean;
  }
}
export type NodeElementSettings = {
  filtered: boolean;
  visibility: {
    cluster: boolean;
  }
}
export type NodeContext = ElementContext & {
  boundingBox: BoundingBox;
  element: NodeElement;
  settings: NodeElementSettings;
}

export type EdgeContext = ElementContext & {
  element: EdgeElement;
  settings: EdgeElementSettings
}

export type Event = keyof typeof EVENT
export type EditorMode = keyof typeof EDITOR_MODE

export type AdditionalDataItem = {
  name: string;
  value: string[];
  type: RDFType;
}

export type DataItem = {
  name: string;
  value: string[];
  type: RDFType;
  additional?: AdditionalDataItem[];
}

export type Ref<T> = React.Ref<T>
export type EdgeElement = EdgeSingular
export type NodeElement = NodeSingular

export type Element = EdgeElement | NodeElement
export type ElementData = NodeData | EdgeData

export type NodeData = {
  id: string;
  position?: Position;
  data?: DataItem[];
}

export type EdgeData = {
  id: string;
  source: string;
  target: string;
  data?: DataItem[];
}

export type GraphData = {
  nodes: NodeData[];
  edges: EdgeData[];
}

type RenderElementParams = {
  cy: Core;
  graphRef: React.RefObject<GraphRef>;
  theme: Theme;
}
export type RenderEdge<Additional extends Record<string, any> = {}> = (c: {
  item: EdgeData;
  element: EdgeElement;
  sourceElement: NodeElement;
  targetElement: NodeElement;
  from: Position;
  to: Position;
  sortedIndex: number;
  index: number;
  count: number;
} & RenderElementParams & Additional) => React.ReactElement

export type RenderNode<Additional extends Record<string, any> = {}> = (c: {
  item: NodeData;
  element: NodeElement;
} & RenderElementParams & Additional) => React.ReactElement

export type ElementType = keyof typeof ELEMENT_TYPE

export type RDFValue = Enumerable<string | number>
export type RDFType = keyof typeof DATA_TYPE

export type PIXIFlexStyle = {
  display?: keyof typeof YogaConstants.Display | 'none';
  position?: keyof typeof YogaConstants.PositionType ;
  alignItems?: keyof typeof YogaConstants.Align;
  justifyContent?: keyof typeof YogaConstants.JustifyContent;
  flexDirection?: keyof typeof YogaConstants.FlexDirection;
  flexWrap?: keyof typeof YogaConstants.FlexWrap;
}
export type PIXIBasicStyle = {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
} & PIXIFlexStyle

export type PIXIBasicProps = {
  interactive?: boolean;
  buttonMode?: boolean;
} & {
  [k in PIXIType.InteractionEventTypes]: (e: PIXI.InteractionEvent) => void
}

export type PIXIShapeStyle = {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

export type {
  Theme,
} from '../core/theme'

export type CytoscapeEvent = keyof typeof CYTOSCAPE_EVENT

type ElementFilterOption<E> = {
  test:(params: {element: E}) => boolean
  settings?: {
    opacity?: number
  }
}
export type ElementConfig = {
  renderEvents?: CytoscapeEvent[];
  filter?: ElementFilterOption<NodeElement|EdgeElement>
}
export type NodeConfig = {
  position?: Position;
  filter?: ElementFilterOption<NodeElement>
} & ElementConfig

export type EdgeConfig = {
  filter?: ElementFilterOption<EdgeElement>
} & ElementConfig

export type Cluster = {
  id: string;
  name: string;
  ids: string[];
  childClusterIds: string[]
  visible?: boolean;
}

export type ClustersByNodeId = Record<string, Cluster[]>

export type ClustersByChildClusterId = Record<string, Cluster[]>

export type GraphConfig = {
  layout?: typeof GraphLayouts['cose'];
  clusters?: Cluster[];
  zoom?: ViewportProps['zoom'];
  transform?: ViewportProps['transform'];
  nodes?: {
    filter?: ElementFilterOption<NodeElement>
    renderEvents?: CytoscapeEvent[];
    ids?: {
      [id: string]: NodeConfig;
    }
  };
  edges?: {
    filter?: ElementFilterOption<EdgeElement>
    renderEvents?: CytoscapeEvent[];
    ids?: {
      [id: string]: EdgeConfig;
    }
  };
  backgroundColor?: string;
  theme?: Theme;
  graphId?: string
}

export type DisplayObjectWithYoga = PIXI.DisplayObject & {
  flex: boolean;
  yoga: YogaLayout;
}

export type PIXIEvents = {
  [k in keyof typeof PIXI_EVENT_NAMES]: (event: PIXI.InteractionEvent) => void
}

export type PIXIDisplayObjectProps = {
  interactive?: boolean;
  buttonMode?: boolean;
} & Partial<PIXIEvents>

export type GraphLabelData = {
  global: { nodes: string[]; edges: string[] };
  nodes: Record<string, string[]>;
  edges: Record<string, string[]>;
  isGlobalFirst?: boolean;
}

export type EventInfo = {
  type: Event;
  item?: ElementData;
  elementId?: string;
  payload?: any;
  dataItem?: DataItem;
  index?: number;
  event?: PIXI.InteractionEvent;
  avoidEventRecording?: boolean;
  avoidHistoryRecording?: boolean;
}

export type OnEvent = (eventInfo: EventInfo) => void

export type DrawLine = (
  arg: Parameters<RenderEdge>[0] & {
    graphics: PIXI.Graphics;
    to: Position;
    from: Position;
  }) => void

export type ViewportRef = Viewport

export type GraphRef = {
  cy: Core;
  app: PIXI.Application;
  viewport: ViewportRef;
}

export type GraphEditorRef = GraphRef & {
}

export type RecordedEvent = {
  data: any
  type: string;
  date: any
  after: number;
}

export type EventHistory = {
  currentIndex: number;
  eventsList: EventInfo[][];
}
