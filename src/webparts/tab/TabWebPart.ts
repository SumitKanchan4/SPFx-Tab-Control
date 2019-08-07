import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, DisplayMode } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';

import * as strings from 'TabWebPartStrings';
import Tab from './components/Tab';
import { ITabProps, ITabInternalProps } from './components/ITabProps';
import { set } from 'lodash';

export interface ITabWebPartProps {
  tabs: ITabInternalProps[];
}

export default class TabWebPart extends BaseClientSideWebPart<ITabWebPartProps> {

  public render(): void {

    if (!this.properties.tabs) {
      set(this.properties, "tabs", []);
    }

    const element: React.ReactElement<ITabProps> = React.createElement(
      Tab,
      {
        tabProps: this.properties,
        isEditMode: this.displayMode == DisplayMode.Edit
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: []
            }
          ]
        }
      ]
    };
  }
}
