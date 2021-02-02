import React from 'react'
import * as R from 'colay/ramda'
// import { Button, } from '@material-ui/core'
import { Div, } from 'colay-ui'
import { 
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useTheme
} from '../../src/core/theme'
import  { GraphEditorProps,GraphEditor } from '../../src/components/GraphEditor'
import { Graph } from '../../src/components'
import {drawLine} from '../../src/components/Graphics'
import defaultData from './data'
import * as C from 'colay/color'
import { getFilterSchema, VIEW_CONFIG_SCHEMA  } from './constants'
import { EVENT } from '../../src/utils/constants'
import {useController} from '../../src/plugins/controller'
// import { Data } from '../../components/Graph/Default'
const filterEdges = (nodes: {id: string}[]) => (edges: {source:string;target:string}[]) => {
  const nodeMap = R.groupBy(R.prop('id'))(nodes)
  return R.filter(
    (edge) => nodeMap[edge.source] && nodeMap[edge.target]
  )(edges)
}

const prepareData = (data) =>  {
  const {
    nodes,
    edges
  } = data
  const preNodes = R.splitEvery(Math.ceil(nodes.length/2))(nodes)[0]
  const preEdges = filterEdges(preNodes)(edges)
  return {
    nodes: preNodes,
    edges: preEdges
  }
}
const data = prepareData(defaultData)
type Props = Partial<GraphEditorProps>

const NODE_SIZE = {
  width: 80,
  height: 80,
}

const NODE_SIZE_RANGE_MAP = {
  size: [60, 100],
  community: [0, 10],
  in_degree: [0, 10],
  out_degree: [0, 10],
  degree: [0, 20],
  year: [
    1969,
    2015
  ],
}
const calculateNodeSize = (data: object, fieldName?: keyof typeof NODE_SIZE_RANGE_MAP) => {
  if (!fieldName) {
    return NODE_SIZE_RANGE_MAP.size[0]
  }
  const fieldRange = NODE_SIZE_RANGE_MAP[fieldName]
  const sizeRangeGap = NODE_SIZE_RANGE_MAP.size[1] - NODE_SIZE_RANGE_MAP.size[0]
  const fieldRangeGap = fieldRange[1] - fieldRange[0]
  const fieldRangeValue = (data[fieldName] ?? fieldRange[0]) - fieldRange[0]
  return  ((fieldRangeValue / fieldRangeGap) * sizeRangeGap) + NODE_SIZE_RANGE_MAP.size[0]
}
const calculateColor = (data: object, fieldName?: keyof typeof NODE_SIZE_RANGE_MAP) => {
  if (!fieldName) {
    return perc2color(0)
  }
  const fieldRange = NODE_SIZE_RANGE_MAP[fieldName]
  const sizeRangeGap = NODE_SIZE_RANGE_MAP.size[1] - NODE_SIZE_RANGE_MAP.size[0]
  const fieldRangeGap = fieldRange[1] - fieldRange[0]
  const fieldRangeValue = (data[fieldName] ?? fieldRange[0]) - fieldRange[0]
  return  perc2color((fieldRangeValue / fieldRangeGap) * 100)
}
const perc2color = (
  perc: number,
  min = 20, 
  max = 80
) => {
  var base = (max - min);

  if (base === 0) { perc = 100; }
  else {
      perc = (perc - min) / base * 100; 
  }
  var r, g, b = 0;
  if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
  }
  else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return '#' + ('000000' + h.toString(16)).slice(-6);
}

const AppContainer = ({
  changeTheme,
  ...rest
}) => {
  const configRef = React.useRef({
    visualization: {
      nodeSize: null,
      nodeColor: null
    },
  })
  const FILTER_SCHEMA = React.useMemo(() => getFilterSchema({
    onPopupPress: () => console.log('popup')
  }), [])
  const [controllerProps] = useController({
    ...data,
    graphConfig: {
      layout: Graph.Layouts.grid,
      zoom: 0.2
    },
    settingsBar: {
      opened: true,
      forms: [FILTER_SCHEMA, VIEW_CONFIG_SCHEMA]
    },
    dataBar: {
      editable: false,
    },
    actionBar: {
      actions: {
        add: { visible: false },
        delete: { visible: false },
      }
    },
    onEvent: ({
      type,
      extraData,
      element,
      draft
    }) => {
      switch (type) {
        case EVENT.SETTINGS_FORM_CHANGED:{
          if (extraData.form.schema.title === FILTER_SCHEMA.schema.title) {

          } else {
            configRef.current.visualization = extraData.value
          }
          return false
          break
        }
      
        default:
          break;
      }
      return null
    }
  },)
  const graphRef = React.useRef(null)
  const theme = useTheme()
  return (
      <Div style={{ display: 'flex', flexDirection: 'column',width: '100%', height: '100%'}}>
      <GraphEditor
        ref={graphRef}
        {...controllerProps}
        extraData={[configRef.current.visualization]}
        style={{ width: '100%', height: 780, }}
        renderNode={({ item, element, cy }) => {
          const size = calculateNodeSize(item.data, configRef.current.visualization.nodeSize)
          const color = calculateColor(item.data, configRef.current.visualization.nodeColor)
          const hasSelectedEdge = element.connectedEdges(':selected').length > 0
          return (
            <Graph.Pressable
              style={{
                width: size,
                height: size,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                backgroundColor: hasSelectedEdge
                ? theme.palette.secondary.main
                : (element.selected()
                  ? theme.palette.primary.main
                  : color),
                // hasSelectedEdge
                //   ? theme.palette.secondary.main
                //   : (element.selected()
                //     ? theme.palette.primary.main
                //     : theme.palette.background.paper),
                borderRadius: size,
              }}
              onPress={() => {
                cy.$(':selected').unselect()
                element.select()
              }}
            >
              <Graph.Text
                style={{
                  position: 'absolute',
                  top: -40,
                  left: 20,
                  color: 'black',
                }}
                isSprite
              >
                {item.id.substring(0, 5)}
              </Graph.Text>
            </Graph.Pressable>
          )
        }}
        // renderNode={({ item: { id, data } }) => {
          // const size = calculateNodeSize(data, configRef.current.visualization.nodeSize)
          // const color = calculateColor(data, configRef.current.visualization.nodeColor)
        //   return (
        //     <Graph.HoverContainer
        //       style={{
        //         width: size,
        //         height: size,
        //         alignItems: 'center',
        //         justifyContent: 'center',
        //         borderRadius: 25,//(size/2 )+10,
        //         backgroundColor: color
        //         }}
        //         renderHoverElement={() => (
        //           <Graph.View
        //             style={{
        //               width: size,
        //               height: 20,
        //               position: 'absolute',
        //               left: 0,
        //               backgroundColor: color
        //             }}
        //           >
        //             <Graph.Text style={{
        //               fontSize: 20,
        //                textAlign: 'center',
        //               }}>
        //               {R.replace('ECLI:NL:', '')(data.ecli)}
        //             </Graph.Text>
        //           </Graph.View>
        //         )}
        //     >
        //       <Graph.Text style={{fontSize: 10}}>
        //         {R.replace('ECLI:NL:', '')(data.ecli)}
        //       </Graph.Text>
        //     </Graph.HoverContainer>
        //   )
        // }}
        {...rest}
      />
      </Div>
  )
}

export const mergeDeepAll = (list: Record<string, any>[]) => R.reduce(
  R.mergeDeepRight,
  // @ts-ignore
  {},
)(list)




export default (props: Props) => {
  const [isDefault, setIsDefault] = React.useState(true)
const changeTheme = () => {
  setIsDefault(!isDefault)
}

  return (
    <ThemeProvider 
      value={isDefault  ? DefaultTheme : DarkTheme}
    >
      <AppContainer  changeTheme={changeTheme} {...props}/>
    </ThemeProvider>
  )
}