import { ITabWebPartProps } from "../TabWebPart";
import { EditorValue } from 'react-rte';
import { ServiceScope } from "@microsoft/sp-core-library";

export interface ITabProps {
  tabProps: ITabWebPartProps;
  isEditMode: boolean;
  serviceScope: ServiceScope;
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
