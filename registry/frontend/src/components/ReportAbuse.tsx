import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './styles.css'
import {Flex, Text, TextArea} from "@radix-ui/themes";
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

const DialogDemo = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button">Report Abuse</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Report Abuse or Inappropriate Content</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          Report Abuse or Inappropriate Content.
          In case of abuse or inappropriate content is found, please inform site owners via this form.
        </Dialog.Description>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="name">
            Name
          </label>
          <input className="Input" id="name" defaultValue="Fill in from user login" />
        </fieldset>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="email">
            email
          </label>
          <input className="Input" id="email" defaultValue="email@login" />
        </fieldset>

         <label className="Label" htmlFor="email">
            Type of abuse
          </label>
          <div style={{ display: 'flex'}}>
      <Checkbox.Root className="CheckboxRoot" id="c1">
        <Checkbox.Indicator className="CheckboxIndicator">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="Label" htmlFor="c1">
        Abuse or Inappropriate content
      </label>
              <Checkbox.Root className="CheckboxRoot" id="c2">
        <Checkbox.Indicator className="CheckboxIndicator">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="Label" htmlFor="c2">
        Copyrighted material
      </label>
    </div>
          <Flex direction="row" gap="3">
              <Checkbox.Root className="CheckboxRoot" id="c2">
        <Checkbox.Indicator className="CheckboxIndicator">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="Label" htmlFor="c2">
        Copyrighted material
      </label>
          </Flex>
        <fieldset className="Fieldset">
          <label className="Label" htmlFor="email">
            Why is the content inappropriate?
          </label>
          <TextArea color="blue" variant="soft"  placeholder="" rows={10} cols={32} />
        </fieldset>
          <Text></Text>

        <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
          <Dialog.Close asChild>
            <button className="Button green">SEND</button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default DialogDemo;