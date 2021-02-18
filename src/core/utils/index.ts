import {
  Collection, Core,
  EdgeSingular, LayoutOptions,
  Layouts, NodeSingular,
} from 'cytoscape'
import * as R from 'colay/ramda'
import { Position } from 'colay/type'
import { DataItem } from '@type'

export const filter = (
  cy: Core,
  predicate: (el: Collection) => boolean | string[],
) => R.ifElse(
  R.is(Array),
  () => R.reduce(
    (accCollection: Collection, id: string) => accCollection.union(
      cy.getElementById(id),
    ), cy.collection(), predicate,
  ),
  cy.elements().filter,
)(predicate)

export const getLabel = (
  dataList: DataItem[] = [],
) => R.find(R.propEq('key', 'label'))(dataList)?.value ?? ''
// export const getContext = <T>(el: NodeSingular|EdgeSingular): Context => el.data().context

type Info = Record<string, {
  element: NodeSingular;
  start: Position;
  current: Position;
}>
export type Props = {
  graphID: string;
  options: LayoutOptions & {
    transform: (el: NodeSingular, pos: Position) => Position;
  };
  onReady?: (layout: Layouts) => void;
  onStart?: (layout: Layouts) => void;
  onStop?: (c: {layout: Layouts;info: Info}) => void;
  predicate?: (cy: EdgeSingular|NodeSingular) => boolean | string[];
}

// {
//   name: 'T',
//   surname: 'S'
// }

export const dataListToObject = (data: DataItem[]) => R.pipe(
  R.map(
    ({ value, name }: DataItem) => ([name, value]),
  ),
  R.fromPairs,
)(data)

// export const layoutCreator = (props: Props) => {
//   const {
//     onReady,
//     onStart,
//     onStop,
//     graphID,
//     options,

//     predicate,
//   } = props
//   const info: Info = {}
//   return () => {
//     let cy = graphs[graphID]
//     if (filter) {
//       // @ts-ignore
//       cy = filter(cy, predicate)
//     }
//     const layout = cy.createLayout(options)
//     if (onReady) {
//       layout.on('layoutready', () => {
//         onReady(layout)
//       })
//     }

//     if (onStart) {
//       layout.on('layoutstart', () => {
//         onStart(layout)
//       })
//     }

//     if (onStop) {
//       layout.on('layoutstop', () => {
//         onStop({ layout, info })
//       })
//     }
//     return layout
//   }
// }
