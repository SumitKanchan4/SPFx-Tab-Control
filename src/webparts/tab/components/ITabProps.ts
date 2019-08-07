import { ITabWebPartProps } from "../TabWebPart";
import { EditorValue } from 'react-rte';

export interface ITabProps {
  tabProps: ITabWebPartProps;
  isEditMode: boolean;
}

export interface ITabInternalProps {
  title: string;
  content: string;
  order: number;
  guid: string;
}

export interface ITabState {
  selectedTab?: string;
  currentContent?: EditorValue;
  currentTitle?: string;
  updateRequired: boolean;
}
