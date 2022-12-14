/*!
 * Portions of this file are based on code from react-spectrum.
 * Apache License Version 2.0, Copyright 2020 Adobe.
 *
 * Credits to the React Spectrum team:
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-aria/radio/src/useRadioGroup.ts
 * https://github.com/adobe/react-spectrum/blob/70e7caf1946c423bc9aa9cb0e50dbdbe953d239b/packages/@react-stately/radio/src/useRadioGroupState.ts
 */

import {
  access,
  createPolymorphicComponent,
  MaybeAccessor,
  mergeDefaultProps,
  mergeRefs,
} from "@kobalte/utils";
import { createUniqueId, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { createControllableSignal } from "../primitives";
import { MenuRadioGroupContext, MenuRadioGroupContextValue } from "./menu-radio-group-context";
import { useMenuContext } from "./menu-context";
import { MenuGroup } from "./menu-group";

export interface MenuRadioGroupProps {
  /** The controlled value of the item radio to check. */
  value?: string;

  /**
   * The value of the item radio that should be checked when initially rendered.
   * Useful when you do not need to control the state of the menu radio group.
   */
  defaultValue?: string;

  /** Event handler called when the value changes. */
  onValueChange?: (value: string | undefined) => void;

  /**
   * A unique identifier for the component.
   * The id is used to generate id attributes for nested components.
   * If no id prop is provided, a generated id will be used.
   */
  id?: string;

  /** The name of the radio group. */
  name?: string;

  /** Whether the form control is disabled. */
  isDisabled?: boolean;
}

/**
 * A container used to group multiple `Menu.ItemRadio`s and manage the selection.
 */
export const MenuRadioGroup = createPolymorphicComponent<"div", MenuRadioGroupProps>(props => {
  const menuContext = useMenuContext();

  const defaultId = menuContext.generateId(`radiogroup-${createUniqueId()}`);

  props = mergeDefaultProps(
    {
      as: "div",
      id: defaultId,
    },
    props
  );

  const [local, others] = splitProps(props, [
    "value",
    "defaultValue",
    "onValueChange",
    "name",
    "isDisabled",
  ]);

  const [selected, setSelected] = createControllableSignal<string | undefined>({
    value: () => local.value,
    defaultValue: () => local.defaultValue,
    onChange: value => local.onValueChange?.(value),
  });

  const context: MenuRadioGroupContextValue = {
    name: () => local.name ?? others.id!,
    isDisabled: () => local.isDisabled,
    isSelectedValue: (value: string) => value === selected(),
    setSelectedValue: setSelected,
  };

  return (
    <MenuRadioGroupContext.Provider value={context}>
      <MenuGroup {...others} />
    </MenuRadioGroupContext.Provider>
  );
});
