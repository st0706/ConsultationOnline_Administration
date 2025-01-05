import { Divider, Group, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Fragment, MouseEvent, useEffect } from "react";
import { ArrayAddButton } from "./ArrayAddButton";
import { ArrayRemoveButton } from "./ArrayRemoveButton";
import classes from "./ResourceArrayInput.module.css";

interface Props<T, V> {
  form: UseFormReturnType<T, (values: T) => T>;
  readonly property: string;
  propertyDisplayName: string;
  newValue?: V;
  label?: React.ReactNode;
  description?: React.ReactNode;
  readonly maxItems?: number;
  readonly indent?: boolean;
  readonly allowAdd?: boolean;
  readonly allowRemove?: boolean;
  readonly alwaysShowDivider?: boolean;
  readonly hideLabel?: boolean;
  renderElement: (path: string, index: number, value: V) => React.ReactNode;
}

const ResourceArrayInput: <T, V>(props: Props<T, V>) => React.ReactNode = ({
  form,
  property,
  propertyDisplayName,
  newValue,
  maxItems,
  label,
  description,
  indent = true,
  allowAdd = true,
  allowRemove = true,
  alwaysShowDivider,
  hideLabel = false,
  renderElement
}) => {
  const values = form.getInputProps(property).value;

  useEffect(() => {
    if (!values) {
      form.setFieldValue(property, [newValue] as any);
    }
  }, []);

  return (
    <div>
      {(label || description || propertyDisplayName) && (
        <TextInput
          type="hidden"
          label={hideLabel ? undefined : label || propertyDisplayName}
          description={description}
        />
      )}
      <Stack className={indent ? classes.indented : undefined}>
        {values &&
          Array.isArray(values) &&
          values.map((value, index) => (
            <Fragment key={index}>
              <Group
                wrap="nowrap"
                gap={4}
                style={{ flexGrow: 1 }}
                className={allowRemove ? classes.canRemove : undefined}>
                <div style={{ flexGrow: 1 }}>{renderElement(`${property}.${index}`, index, value)}</div>
                {allowRemove && (
                  <ArrayRemoveButton
                    className={classes.removeButton}
                    propertyDisplayName={propertyDisplayName}
                    onClick={(e: MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.removeListItem(property, index);
                    }}
                  />
                )}
              </Group>
              {index < values.length - 1 && <Divider hiddenFrom={alwaysShowDivider ? undefined : "sm"} />}
            </Fragment>
          ))}
        {allowAdd && (!maxItems || values.length < maxItems) && (
          <Group wrap="nowrap" style={{ justifyContent: "flex-start" }}>
            <ArrayAddButton
              propertyDisplayName={propertyDisplayName}
              showText={!!propertyDisplayName}
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (!values) {
                  form.setFieldValue(property, [] as any);
                }
                form.insertListItem(property, newValue || {});
              }}
            />
          </Group>
        )}
      </Stack>
    </div>
  );
};

export default ResourceArrayInput;
