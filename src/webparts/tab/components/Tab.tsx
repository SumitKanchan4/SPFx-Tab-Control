import * as React from 'react';
import styles from './Tab.module.scss';
import { ITabProps, ITabState, ITabInternalProps } from './ITabProps';
import { set } from '@microsoft/sp-lodash-subset';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import RichTextEditor, { EditorValue } from 'react-rte';
import { TabConstants } from '../../../common/TabConstants';
import TabHelper from '../../../common/TabHelper';

export default class Tab extends React.Component<ITabProps, ITabState> {

  constructor(props: ITabProps, state: ITabState) {
    super(props);

    let isConfigured: boolean = this.props.tabProps.tabs.length > 0;

    this.state = {
      currentContent: isConfigured ? RichTextEditor.createValueFromString(this.props.tabProps.tabs[0].content, 'html') : RichTextEditor.createValueFromString(TabConstants.NO_TAB_ADDED, 'html'),
      selectedTab: isConfigured ? this.props.tabProps.tabs[0].guid : TabConstants.ADD_TAB_GUID,
      currentTitle: isConfigured ? this.props.tabProps.tabs[0].title : undefined,
      updateRequired: false
    };
  }

  public render(): React.ReactElement<ITabProps> {

    const tabInfo = this.props.tabProps.tabs;

    return (
      <div className={styles.tab}>
        <div className={styles.container}>

          {/* Row to show the Tabs Header only */}
          <div className={styles.row}>
            <div className={`${styles.tabHeader}`}>
              {
                <Pivot headersOnly={true} onLinkClick={(item) => this.tabClicked(item)} selectedKey={this.state.selectedTab}>
                  {
                    Object.keys(tabInfo).map(name => (
                      <PivotItem key={`pivotItemKey_${name}`} style={{ backgroundColor: 'aliceblue' }} headerText={tabInfo[Number(name)].title} itemKey={tabInfo[Number(name)].guid} ></PivotItem>
                    ))
                  }
                  {
                    this.props.isEditMode ?
                      <PivotItem itemKey={TabConstants.ADD_TAB_GUID} itemIcon={`BoxAdditionSolid`} title={`Add new tab`} ></PivotItem>
                      :
                      <div></div>
                  }
                </Pivot>
              }
            </div>
          </div>

          {/* Row to show the rich text box and the selected tab content */}
          <div className={styles.row}>
            <div className={`${styles.column} ${styles.showScreen}`}>

              <div className={styles.grid}>
                {
                  this.props.isEditMode && this.props.tabProps.tabs.length > 0 ?
                    <div className={styles.row}>
                      <div className={`${styles.column} ${styles.editScreen}`}>
                        <TextField placeholder={`Enter the tab title here`} description={`Enter the tab title here`} value={this.state.currentTitle} onChanged={text => this.onTitleChange(text)}></TextField>
                      </div>
                      <div className={`${styles.column} ${styles.delTab}`}>
                        <IconButton iconProps={{ iconName: "Delete" }} title={`Delete tab`} onClick={() => this.deleteTab()}></IconButton>
                      </div>
                    </div>
                    : <div></div>
                }

                <div className={styles.row}>
                  <div className={`${styles.column} ${styles.showScreen}`}>
                    <RichTextEditor value={this.state.currentContent} readOnly={!this.props.isEditMode || this.props.tabProps.tabs.length == 0} onChange={(text) => this.onChange(text)} >
                    </RichTextEditor>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

  /**
   * Tab click event
   * @param item 
   */
  private tabClicked(item: PivotItem): void {

    let tabKey = item.props.itemKey;
    // If new tab is clicked
    if (item.props.itemKey === TabConstants.ADD_TAB_GUID) {
      tabKey = this.createNewTab();
    }

    //Update the state based on the selected Tab
    let currentitem: ITabInternalProps[] = this.props.tabProps.tabs.filter(filterItem => filterItem.guid === tabKey);

    if (currentitem && currentitem.length > 0) {

      this.setState({
        currentContent: RichTextEditor.createValueFromString(currentitem[0].content, 'html'),
        currentTitle: currentitem[0].title,
        selectedTab: currentitem[0].guid,
        updateRequired: true
      });
    }
  }

  /**
   * Creates a new tab and returns the id of the newly created tab
   */
  private createNewTab(): string {
    let newKey: string = new TabHelper().generateGuid;
    let newArray: ITabInternalProps[] = this.props.tabProps.tabs;
    newArray.push({
      content: '<p></p>',
      guid: newKey,
      order: 1,
      title: `Tab ${this.props.tabProps.tabs.length}`
    });
    set(this.props.tabProps, "tabs", newArray);
    //this.setState({ updateRequired: true });
    return newKey;
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    alert('error');
  }

  /**
   * On change event for the RichTextBox
   */
  onChange = (value: EditorValue) => {

    // Update the state and props
    let prop = this.props;

    prop.tabProps.tabs.filter(item => item.guid === this.state.selectedTab)[0].content = value.toString('html');
    set(this.props.tabProps, "tabs", prop.tabProps.tabs);
    this.setState({ currentContent: value, updateRequired: true });
  }

  private onTitleChange(value: string) {

    // Update the state and props
    let prop = this.props;

    prop.tabProps.tabs.filter(item => item.guid === this.state.selectedTab)[0].title = value;
    set(this.props.tabProps, "tabs", prop.tabProps.tabs);
    this.setState({ currentTitle: value, updateRequired: true });
  }

  private deleteTab(): void {
    // Update the state and props
    let tabArray: ITabInternalProps[] = [];
    tabArray = this.props.tabProps.tabs.filter(item => item.guid != this.state.selectedTab);
    set(this.props.tabProps, "tabs", tabArray);
    this.setState({
      updateRequired: true,
      currentContent: tabArray.length > 0 ? RichTextEditor.createValueFromString(tabArray[0].content, 'html') : RichTextEditor.createValueFromString(TabConstants.NO_TAB_ADDED, 'html'),
      currentTitle: tabArray.length > 0 ? tabArray[0].title : 'Tab 0',
      selectedTab: tabArray.length > 0 ? tabArray[0].guid : TabConstants.ADD_TAB_GUID
    });
  }

  public shouldComponentUpdate(nextProps: ITabProps, nextState: ITabState, context: any): boolean {
    return nextState.updateRequired;
  }

}
