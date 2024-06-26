import React from 'react'
import {Modal, Button, Paper} from '@mui/material'
import {FormProps} from '@rjsf/core'
import {Form} from '@components/Form'
import * as R from 'colay/ramda'
import {useGraphEditor} from '@hooks'
import {EVENT} from '@constants'
import validator from '@rjsf/validator-ajv8'
// import {
//   View,
// } from 'colay-ui'

export type ModalComponentProps = {
  isOpen?: boolean
  render?: (props: any) => React.ReactElement
  form?: FormProps<any>
  onClose?: () => void
  name: string
}

export const ModalComponent = (props: ModalComponentProps) => {
  const {isOpen = false, render, form, onClose, name} = props
  // const Component = render
  const [{onEvent}] = useGraphEditor(editor => ({
    onEvent: editor.onEvent
  }))
  const onCloseCallback = React.useCallback(() => {
    onClose?.()
    onEvent({
      type: EVENT.CLOSE_MODAL,
      payload: {
        name
      }
    })
  }, [onClose])
  return (
    <Modal
      open={isOpen}
      onClose={onCloseCallback}
      onBackdropClick={onCloseCallback}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {form ? (
        <Paper
          style={{
            maxWidth: '80%',
            maxHeight: '90%',
            overflow: 'scroll',
            padding: 2
          }}
        >
          <Form {...form} schema={R.omit(['title'])(form.schema)} validator={ validator}>
            {form.children ?? (
              <Button type="submit" fullWidth variant="contained">
                Apply
              </Button>
            )}
          </Form>
        </Paper>
      ) : (
        <>{render?.({})}</>
      )}
    </Modal>
  )
}
