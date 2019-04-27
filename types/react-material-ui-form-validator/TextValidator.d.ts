import React from 'react';
import { StandardProps, PropTypes } from '@material-ui/core';
import {
  FormControlClassKey,
  FormControlProps,
} from '@material-ui/core/FormControl';
import { FormHelperTextProps } from '@material-ui/core/FormHelperText';
import { InputProps as StandardInputProps } from '@material-ui/core/Input';
import { FilledInputProps } from '@material-ui/core/FilledInput';
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import { InputLabelProps } from '@material-ui/core/InputLabel';
import { SelectProps } from '@material-ui/core/Select';

export interface BaseTextFieldProps
  extends StandardProps<
    FormControlProps,
    TextFieldClassKey,
    'onChange' | 'defaultValue'
  > {
  autoComplete?: string;
  autoFocus?: boolean;
  children?: React.ReactNode;
  defaultValue?: string | number;
  disabled?: boolean;
  error?: boolean;
  FormHelperTextProps?: Partial<FormHelperTextProps>;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  id?: string;
  InputLabelProps?: Partial<InputLabelProps>;
  inputRef?: React.Ref<any> | React.RefObject<any>;
  label?: React.ReactNode;
  margin?: PropTypes.Margin;
  multiline?: boolean;
  name?: string;
  onChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  placeholder?: string;
  required?: boolean;
  rows?: string | number;
  rowsMax?: string | number;
  select?: boolean;
  SelectProps?: Partial<SelectProps>;
  type?: string;
  value?: Array<string | number | boolean> | string | number | boolean;
}

export interface StandardTextFieldProps extends BaseTextFieldProps {
  variant?: 'standard';
  InputProps?: Partial<StandardInputProps>;
  inputProps?: StandardInputProps['inputProps'];
}

export interface FilledTextFieldProps extends BaseTextFieldProps {
  variant: 'filled';
  InputProps?: Partial<FilledInputProps>;
  inputProps?: FilledInputProps['inputProps'];
}

export interface OutlinedTextFieldProps extends BaseTextFieldProps {
  variant: 'outlined';
  InputProps?: Partial<OutlinedInputProps>;
  inputProps?: OutlinedInputProps['inputProps'];
}

export type TextFieldProps =
  | StandardTextFieldProps
  | FilledTextFieldProps
  | OutlinedTextFieldProps;

export type TextFieldClassKey = FormControlClassKey;

declare const TextValidator: React.ComponentType<TextFieldProps>;

export default TextValidator;