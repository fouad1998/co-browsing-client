import React, { MouseEvent } from 'react';
import { Row, Col, Input, Button, Layout, Modal, Switch } from 'antd';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ReorderIcon from '@material-ui/icons/Reorder';
import ReplayIcon from '@material-ui/icons/Replay';
import SettingsIcon from '@material-ui/icons/Settings';
import BuildIcon from '@material-ui/icons/Build';
import CreateIcon from '@material-ui/icons/Create';
import SendIcon from '@material-ui/icons/Send';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CloseIcon from '@material-ui/icons/Close';
import BrushIcon from '@material-ui/icons/Brush';
import Crop32Icon from '@material-ui/icons/Crop32';
import NearMeRoundedIcon from '@material-ui/icons/NearMeRounded';
import { ToolsStyle } from './cobrowsing.style';
import { coBrowsingReducer, CO_BROWSING_REDUCER, TOOL_USING } from './coBrowsingReducer';
import { Browsing } from '.';

const App: React.FC<{}> = (props) => {
  const browsing = React.useContext(Browsing);

  const ref = React.useRef<HTMLDivElement>(null);

  const [state, dispatch] = React.useReducer(
    coBrowsingReducer,
    {
      currentURL: 'https://stackoverflow.com/questions/4057270/how-to-access-css-properties-in-javascript-when-applied-via-external-css-file',
      session: null,
      selectedTool: TOOL_USING.MOUSE,
      showTools: false,
      showSettings: false,
      sameUserScreenSize: false,
      startedSession: false,
      sessionKey: '',
      showHistory: false,
    },
    (state) => ({ ...state, session: browsing!.getSession() })
  );

  const [modifyURL, setModifyURL] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (ref.current && browsing!.getConfig().root !== ref.current) {
      browsing!.setConfig({ root: ref.current });
    }
  }, [ref.current]);

  React.useEffect(() => {
    let mounted = true;
    browsing?.setConfig({
      onchangeURL: (url: string) => {
        mounted &&
          dispatch({
            type: CO_BROWSING_REDUCER.URL,
            payload: { currentURL: url },
          });
      },
      onstartSession: () => {
        mounted &&
          dispatch({
            type: CO_BROWSING_REDUCER.SESSION_START,
            payload: { startedSession: true },
          });
      },
    });

    return () => {
      mounted = false;
    };
  }, []);

  const URLBarClickHandler = React.useCallback(
    (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
      event.stopPropagation();
      setModifyURL(true);
      if (state.session?.started) {
      }
    },
    [state.session]
  );

  const URLBarBlurHandler = React.useCallback(() => {
    setModifyURL(false);
  }, []);

  const URLOnChangeHandler = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const value = event.target.value;
    dispatch({
      type: CO_BROWSING_REDUCER.URL,
      payload: { currentURL: value },
    });
  }, []);

  const URLEmptyClickHandler = React.useCallback((event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
    event.stopPropagation();
    dispatch({
      type: CO_BROWSING_REDUCER.URL,
      payload: { currentURL: '' },
    });
  }, []);

  const showToolsHandler = React.useCallback(
    (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
      event.stopPropagation();
      dispatch({
        type: CO_BROWSING_REDUCER.SHOW_TOOLS,
        payload: { showTools: !state.showTools },
      });
    },
    [state.showTools]
  );

  const selectToolHandler = React.useCallback(
    (tool: TOOL_USING) => {
      dispatch({
        type: CO_BROWSING_REDUCER.TOOL_CHANGE,
        payload: { selectedTool: tool },
      });
    },
    [state.selectedTool]
  );

  const settingsShowHandler = React.useCallback(
    (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
      event.stopPropagation();
      dispatch({
        type: CO_BROWSING_REDUCER.SHOW_SETTINGS,
        payload: { showSettings: !state.showSettings },
      });
    },
    [state.showSettings]
  );

  const sameUserScreenSizeHandler = React.useCallback((event: boolean) => {
    dispatch({
      type: CO_BROWSING_REDUCER.SAME_USER_SCREEN_SIZE,
      payload: { sameUserScreenSize: event },
    });
  }, []);

  const settingsSaveHandler = React.useCallback(() => {
    browsing!.setConfig({ sameScreenSize: state.sameUserScreenSize });
    dispatch({
      type: CO_BROWSING_REDUCER.SHOW_SETTINGS,
      payload: { showSettings: false },
    });
  }, [state.sameUserScreenSize, browsing]);

  const settingsCancelHandler = React.useCallback(() => {
    const config = browsing!.getConfig();
    dispatch({
      type: CO_BROWSING_REDUCER.SAME_USER_SCREEN_SIZE,
      payload: { sameUserScreenSize: config.sameScreenSize },
    });
    dispatch({
      type: CO_BROWSING_REDUCER.SHOW_SETTINGS,
      payload: { showSettings: false },
    });
  }, [state.sameUserScreenSize]);

  const sessionKeyChangeHandler = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const value = event.target.value;
    dispatch({
      type: CO_BROWSING_REDUCER.SESSION_KEY,
      payload: { sessionKey: value },
    });
  }, []);

  const showHistoryHandler = React.useCallback(
    (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
      event.stopPropagation();
      dispatch({
        type: CO_BROWSING_REDUCER.SESSION_KEY,
        payload: { showHistory: !state.showHistory },
      });
    },
    [state.showHistory]
  );

  const reloadClickHandler = React.useCallback(
    (event: React.MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
      event.stopPropagation();
      browsing?.reloadThePage();
    },
    [browsing]
  );

  return (
    <Layout style={{ height: '100vh', maxHeight: '100vh', maxWidth: '100vw', minHeight: '100vh', minWidth: '100vw' }}>
      <Row style={{ overflow: 'hidden' }}>
        {/** Title */}
        <Col span={24} style={{ height: '60px', padding: '0 20px', background: '#f5f5f5' }}>
          <Row style={{ height: 'inherit', alignItems: 'center' }}>
            <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
              <h1
                style={{
                  padding: 0,
                  margin: 0,
                  fontSize: 'x-large',
                  fontVariant: 'all-petite-caps',
                  fontStyle: 'oblique',
                  color: '#3535d2',
                  fontWeight: 'bolder',
                  letterSpacing: '0.5mm',
                }}
              >
                Emplorium
              </h1>
            </Col>
            <Col span={12}>
              <ToolsStyle>
                {state.showTools && (
                  <>
                    {[
                      [<NearMeRoundedIcon />, TOOL_USING.MOUSE],
                      [<BrushIcon />, TOOL_USING.BRUSH],
                      [<CreateIcon />, TOOL_USING.PENCIL],
                      [<Crop32Icon />, TOOL_USING.RECTANGLE],
                    ].map((e, index) => {
                      return (
                        <Button
                          key={index}
                          shape="circle"
                          type={state.selectedTool === e[1] ? 'primary' : 'default'}
                          onClick={(event) => {
                            event.stopPropagation();
                            selectToolHandler(e[1] as TOOL_USING);
                          }}
                        >
                          {e[0]}
                        </Button>
                      );
                    })}
                  </>
                )}
                <Button shape="circle" onClick={showToolsHandler}>
                  {state.showTools ? <CloseIcon /> : <BuildIcon />}
                </Button>
                <Button shape="circle" onClick={settingsShowHandler}>
                  <SettingsIcon />
                </Button>
              </ToolsStyle>
            </Col>
          </Row>
        </Col>
        <Col span={24} style={{ position: 'relative' }}>
          <Row>
            {/** ASk for key */}
            {!state.startedSession && (
              <Col
                span={24}
                style={{ height: '100%', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: '#FFF9', zIndex: 10 }}
              >
                <Row justify="center" align="middle" style={{ height: 'inherit' }}>
                  <Col span={14} style={{ background: 'white', padding: 30 }}>
                    <Row>
                      <Col span={24}>
                        <h3>Enter the session key in order to join</h3>
                      </Col>
                      <Col span={24} style={{ padding: '10px 0' }}>
                        <Input onChange={sessionKeyChangeHandler} />
                      </Col>
                      <Col span={24}>
                        <Button type="primary">Start</Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            )}
            {/** Header */}
            <Col span={24} style={{ height: 50, padding: '0 10px', background: '#EEE' }}>
              <Row style={{ justifyContent: 'center', alignItems: 'center', height: 'inherit' }}>
                {/** Controllers */}
                <Col span={4}>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Row>
                        <Col span={12}>
                          <Button>
                            <ArrowBackIosIcon />
                          </Button>
                        </Col>
                        <Col span={12}>
                          <Button>
                            <ArrowForwardIosIcon />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={12}>
                      <Row>
                        <Col span={12}>
                          <Button type={'primary'} onClick={showHistoryHandler}>
                            <ReorderIcon />
                          </Button>
                        </Col>
                        <Col span={12}>
                          <Button type={'primary'} onClick={reloadClickHandler}>
                            <ReplayIcon />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>

                {/** URL */}
                <Col span={18} offset={1} style={{ height: '65%', fontSize: '15px', borderRadius: 5 }}>
                  <Row style={{ height: '100%' }}>
                    <Col span={24} style={{ height: 'inherit' }}>
                      <Row style={{ height: 'inherit' }}>
                        <Col
                          span={modifyURL ? 24 : 22}
                          onClick={URLBarClickHandler}
                          style={{
                            padding: modifyURL ? 0 : '0px 5px 0 10px',
                            height: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                            background: 'white',
                            overflow: 'hidden',
                          }}
                        >
                          {!modifyURL && state.currentURL}
                          {modifyURL && (
                            <Input
                              autoFocus
                              value={state.currentURL}
                              onChange={URLOnChangeHandler}
                              onBlur={URLBarBlurHandler}
                              addonAfter={
                                <Button type="ghost" onClick={URLEmptyClickHandler}>
                                  {' '}
                                  <HighlightOffIcon />
                                </Button>
                              }
                              style={{ height: 'inherit', width: '100%' }}
                            />
                          )}
                        </Col>
                        <Col span={modifyURL ? 0 : 2} style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button type="primary">
                            <SendIcon />
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={24} style={{ width: '50%', backgroundColor: 'white', position: 'absolute', top: 50, left: 0 }}>
              <Row>
                {state.session?.history.map((URL, index) => (
                  <Col span={24} key={index} style={{ padding: '10px 5px' }}>
                    {URL}
                  </Col>
                ))}
              </Row>
            </Col>
            {/** Settings */}
            <Modal visible={state.showSettings} title="Settings" onOk={settingsSaveHandler} onCancel={settingsCancelHandler} keyboard={true}>
              <Row>
                <Col span={24}>
                  <Row>
                    <Col span={20}>Same user screen size</Col>
                    <Col span={4}>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        defaultChecked={state.sameUserScreenSize}
                        onChange={sameUserScreenSizeHandler}
                        checked={state.sameUserScreenSize}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Modal>
            {/** Co Browsing zone */}
            <Col span={24} style={{ height: 'calc(100vh - 110px)', background: 'red' }}>
              <div ref={ref as React.RefObject<HTMLDivElement>} style={{ height: '100%', width: '100%', position: 'relative' }}></div>{' '}
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};

export default React.memo(App);
