import { Icon } from '@components/Icon'
import { SortableList } from '@components/SortableList'
import { SpeedDialCreator } from '@components/SpeedDialCreator'
import {
  EVENT,
} from '@constants'
import {
  useGraphEditor,
} from '@hooks'
import {
  Button,
  Card, Checkbox,
  Dialog,
  DialogTitle, IconButton, List,
  ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, TextField, Typography,
} from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import {
  View,
} from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import * as R from 'colay/ramda'
import React from 'react'

export type EventHistoryTableProps = {
  isOpen?: boolean;
  // onPlay: (playlist: Playlist) => void
  createPlaylistDialog: {
    visible: boolean;
    onClose: () => void;
  }
  onCreatePlaylist: (param: {
    id: string;
    name: string;
  }) => void
}

// onSelectPlaylist={(playlist, checked) => {
//   updateState((draft) => {
//     if (checked) {
//       draft.selectedPlaylistIds.push(playlist.id)
//     } else {
//       draft.selectedPlaylistIds = draft.selectedPlaylistIds.filter(
//         (id) => id !== playlist.id,
//       )
//     }
//   })
// }}
// selectedPlaylistIds={state.selectedPlaylistIds}

export const PlaylistTable = (props: EventHistoryTableProps) => {
  const {
    createPlaylistDialog,
    onCreatePlaylist,
  } = props
  const [
    {
      onEvent,
      playlists = [],
    },
  ] = useGraphEditor(
    (editor) => ({
      onEvent: editor.onEvent,
      playlists: editor.playlists,
    }),
  )
  const [state, updateState] = useImmer({
    expanded: false,
    createPlaylistDialog: {
      name: '',
    },
    selectedPlaylistIds: [] as string[],
  })
  const hasSelected = state.selectedPlaylistIds.length > 0
  return (
    <>
      <Accordion
        expanded={state.expanded}
        onChange={(e, expanded) => updateState((draft) => {
          draft.expanded = expanded
        })}
      >
        <AccordionSummary
          aria-controls="panel1a-content"
        >
          <View
            style={{
              width: '100%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h6"
                >
                  Playlists
                </Typography>
              </View>
            </View>
            {
            state.expanded && hasSelected && (
              <Card
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  height: 32,
                  width: '100%',
                }}
              >
                <ListItem>
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
                    checked={!R.isEmpty(state.selectedPlaylistIds)
               && state.selectedPlaylistIds.length === playlists.length}
                    onChange={(e) => {
                      const { checked } = e.target
                      updateState((draft) => {
                        if (checked) {
                          draft.selectedPlaylistIds = playlists.map((playlist) => playlist.id)
                        } else {
                          draft.selectedPlaylistIds = []
                        }
                      })
                    }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                      updateState((draft) => {
                        draft.selectedPlaylistIds = []
                      })
                      onEvent({
                        type: EVENT.DELETE_PLAYLIST,
                        payload: {
                          itemIds: state.selectedPlaylistIds,
                        },
                      })
                    }}
                  >
                    <Icon
                      name="delete_rounded"
                    />
                  </IconButton>
                </ListItem>
              </Card>
            )
              }
          </View>

        </AccordionSummary>
        <AccordionDetails>
          {
          playlists.length === 0 && (
            <Typography>
              Let's create a playlist.
            </Typography>
          )
        }
          <List dense>
            <SortableList
              onReorder={(result) => onEvent({
                type: EVENT.REORDER_PLAYLIST,
                payload: {
                  fromIndex: result.source.index,
                  toIndex: result.destination!.index,
                },
              })}
              data={playlists}
              renderItem={({
                provided,
                item: playlist,
              }) => {
                const { events, id, name } = playlist
                return (
                  <Accordion
                    key={id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <AccordionSummary
                      aria-controls="panel1a-content"
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Checkbox
                            onClick={(e) => e.stopPropagation()}
                            checked={hasSelected
                          && state.selectedPlaylistIds.includes(playlist.id)}
                            onChange={(e) => {
                              const { checked } = e.target
                              updateState((draft) => {
                                if (checked) {
                                  draft.selectedPlaylistIds.push(playlist.id)
                                } else {
                                  draft.selectedPlaylistIds = draft.selectedPlaylistIds.filter(
                                    (id) => id !== playlist.id,
                                  )
                                }
                              })
                            }}
                            inputProps={{ 'aria-label': 'primary checkbox' }}
                          />
                          <Typography
                            variant="h6"
                          >
                            {name}
                          </Typography>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <SpeedDialCreator
                            actions={[
                              {
                                name: 'Delete',
                                icon: {
                                  name: 'delete_rounded',
                                },
                                onClick: (e) => {
                                  e.stopPropagation()
                                  updateState((draft) => {
                                    draft.selectedPlaylistIds = []
                                  })
                                  onEvent({
                                    type: EVENT.DELETE_PLAYLIST,
                                    payload: {
                                      itemIds: [playlist.id],
                                    },
                                  })
                                },
                              },
                              {
                                name: 'Play',
                                icon: {
                                  name: 'play_arrow',
                                },
                                onClick: (e) => {
                                  e.stopPropagation()
                                  onEvent({
                                    type: EVENT.PLAY_EVENTS,
                                    payload: {
                                      events: playlist.events,
                                    },
                                  })
                                },
                              },
                            ]}
                          />
                          <IconButton
                            edge="end"
                            disableFocusRipple
                            disableRipple
                            disableTouchRipple
                            {...provided.dragHandleProps}
                          >
                            <Icon name="drag_handle" />
                          </IconButton>
                        </View>
                      </View>
                    </AccordionSummary>
                    <AccordionDetails>
                      {
                        events.map((event) => (
                          <ListItem
                            key={event.id}
                          >
                            <ListItemAvatar>
                              <Checkbox
                                // checked={state.selectedPlaylistIds.includes(id)}
                                // onChange={(_, checked) => {
                                //   updateState((draft) => {
                                //     if (checked) {
                                //       draft.selectedPlaylistIds.push(playlist.id)
                                //     } else {
                                //       draft.selectedPlaylistIds = draft.selectedPlaylistIds.filter(
                                //         (id) => id !== playlist.id,
                                //       )
                                //     }
                                //   })
                                // }}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={event.type}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <Icon name="delete_rounded" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))
                      }
                    </AccordionDetails>
                  </Accordion>
                )
              }}
            />
          </List>
        </AccordionDetails>
      </Accordion>
      <Dialog
        onClose={createPlaylistDialog.onClose}
        aria-labelledby="create-playlist-dialog-title"
        open={createPlaylistDialog.visible}
      >
        <DialogTitle id="create-playlist-dialog-title">Create Playlist</DialogTitle>
        <View
          style={{
            width: '50%',
            padding: 10,
            justifyContent: 'center',
          }}
        >
          <TextField
            style={{
              marginBottom: 10,
              width: '50vw',
            }}
            fullWidth
            label="name"
            value={state.createPlaylistDialog.name}
            onChange={({ target: { value } }) => updateState((draft) => {
              draft.createPlaylistDialog.name = value
            })}
          />
          <Button
            fullWidth
            onClick={() => {
              onCreatePlaylist({
                id: R.uuid(),
                name: state.createPlaylistDialog.name,
              })
              updateState((draft) => {
                draft.createPlaylistDialog.name = ''
              })
            }}
          >
            Create
          </Button>
        </View>
      </Dialog>
    </>
  )
}