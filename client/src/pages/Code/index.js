import React, { useEffect, useRef, useState } from "react";

import FadeIn from "react-fade-in";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHtml5,
  faCss3Alt,
  faJsSquare,
} from "@fortawesome/free-brands-svg-icons";
import { faImage, faSquare } from "@fortawesome/free-regular-svg-icons";
import { faFont } from "@fortawesome/free-solid-svg-icons";

import _ from "lodash";

import { useParams } from "react-router-dom";

import { requestPlatformViaId } from "utils/store/reducer/platform";

import { requestCodeCheck, initCodeChecker } from "utils/store/reducer/code";

import { useDispatch, useSelector } from "react-redux";
import {
  Collapse,
  Layout,
  Typography,
  theme,
  Space,
  Tag,
  Divider,
  Row,
  Col,
  Tooltip,
  Button,
  Popover,
  Input,
} from "antd";

import {
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  LinkOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import logoMini from "assets/images/smartly-mini.svg";
import Loader from "components/Loader";
import { ReactCompareSlider } from "react-compare-slider";

const { Panel } = Collapse;
const { Header, Content, Sider } = Layout;

export default function Code() {
  const dispatch = useDispatch();

  const [sideOpen, setSideOpen] = useState(0);
  const [codeRange, setCodeRange] = useState(null);

  const { platform, links, overview } = useSelector((state) => state.platform);
  const { data: codeChecker } = useSelector((state) => state.code);

  const { codeId } = useParams();
  const mounted = useRef(true);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    if (!mounted.current) {
      return;
    }

    mounted.current = false;

    dispatch(initCodeChecker());
    _.isEmpty(platform) && dispatch(requestPlatformViaId({ codeId }));
  }, []);

  useEffect(() => {
    !_.isEmpty(platform) &&
      platform[0].map(
        (data) =>
          !_.isEmpty(data?.name) &&
          data?.name !== "__platform_preview.html" &&
          data?.name !== "" &&
          !_.isUndefined(data?.code) &&
          dispatch(
            requestCodeCheck({
              name: data?.name,
              left: data?.code,
              right: _.find(
                platform[1],
                (compare) => compare?.name === data?.name
              )?.code,
              diff_level: "word",
            })
          )
      );

    setCodeRange(
      _.filter(
        platform[0]?.map(
          (data) =>
            !_.isEmpty(data?.name) &&
            data?.name !== "__platform_preview.html" &&
            data?.name !== "" &&
            !_.isUndefined(data?.code)
        ),
        (fil) => fil === true
      )?.length === 0
        ? null
        : _.filter(
            platform[0]?.map(
              (data) =>
                !_.isEmpty(data?.name) &&
                data?.name !== "__platform_preview.html" &&
                data?.name !== "" &&
                !_.isUndefined(data?.code)
            ),
            (fil) => fil === true
          )?.length
    );

    !_.isEmpty(platform) && setSideOpen(200);
  }, [platform]);

  return (
    <Layout className="code">
      <Header className="header">
        <div>
          <img src={logoMini} alt="smartly mini" className="logo" />
          <Typography.Text className="title">Code Checker</Typography.Text>
        </div>
      </Header>
      {codeRange !== codeChecker?.length ? (
        <Loader />
      ) : (
        <FadeIn>
          <Content
            style={{
              padding: "20px 50px",
            }}
          >
            <div
              style={{
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex" }}>
                <Input
                  placeholder="Search"
                  style={{ borderRadius: "3px", width: "200px" }}
                  disabled
                />
                <Button
                  style={{
                    borderRadius: "3px",
                    backgroundColor: "#eb2f96",
                    marginLeft: "8px",
                  }}
                  type="primary"
                  icon={<FilterOutlined />}
                  disabled
                />
              </div>
              <div style={{ display: "flex" }}>
                <Popover
                  placement="bottomRight"
                  content={<>Hello</>}
                  trigger="click"
                >
                  <Button
                    style={{ borderRadius: "3px", backgroundColor: "#eb2f96" }}
                    icon={<PlusOutlined />}
                    type="primary"
                    disabled
                  >
                    Generate New
                  </Button>
                </Popover>
                <Button
                  style={{
                    borderRadius: "3px",
                    backgroundColor: "#eb2f96",
                    marginLeft: "8px",
                  }}
                  type="primary"
                  icon={<InfoCircleOutlined />}
                  disabled
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #d7d7d7",
                backgroundColor: "#c3c3c3cc",
              }}
            >
              <ReactCompareSlider
                style={{ display: 'flex'}}
                itemOne={
                  <iframe
                    src={`${overview[0]?.contentLocation}/index.html`}
                    width={Number(overview[0]?.size?.split("x")[0])}
                    height={Number(overview[0]?.size?.split("x")[1])}
                    style={{ border: 0 }}
                  />
                }
                itemTwo={
                  <iframe
                    src={`${overview[1]?.contentLocation}/index.html`}
                    width={Number(overview[1]?.size?.split("x")[0])}
                    height={Number(overview[1]?.size?.split("x")[1])}
                    style={{ border: 0 }}
                  />
                }
              ></ReactCompareSlider>
            </div>
            <Layout
              style={{
                padding: "24px 0 24px 24px",
                minHeight: "calc(100vh - 150px)",
                background: colorBgContainer,
              }}
            >
              <Sider style={{ background: "#fff" }} width={sideOpen}>
                <div
                  style={{
                    background: "#ececec",
                    width: "100%",
                    height: "100%",
                    padding: "0.7em 0",
                  }}
                >
                  <div style={{ padding: "0 1em" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <a
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "0.2em",
                          color: "#eb2f96",
                        }}
                        href={!_.isEmpty(links) && Object.values(links[0])[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkOutlined style={{ marginRight: "0.2em" }} />
                        <Typography.Text
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            color: "#eb2f96",
                          }}
                        >
                          Original File
                        </Typography.Text>
                      </a>
                      <Typography
                        style={{ fontSize: "10px", color: "#947bb7" }}
                      >{`${
                        _.filter(
                          _.sortBy(platform[0], (o) => o.name)?.map(
                            (data) =>
                              data?.name !== "__platform_preview.html" &&
                              data?.name !== "" &&
                              data?.name
                          ),
                          (fil) => fil !== false
                        ).length
                      } Files`}</Typography>
                    </div>

                    {_.sortBy(platform[0], (o) => o.name)?.map(
                      (data, index) =>
                        data?.name !== "__platform_preview.html" &&
                        data?.name !== "" && (
                          <div
                            key={index}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FontAwesomeIcon
                              style={{
                                color: ["html", "htm"].includes(
                                  data?.name?.split(".").pop()
                                )
                                  ? "#ff6505"
                                  : ["css", "less", "sass", "scss"].includes(
                                      data?.name?.split(".").pop()
                                    )
                                  ? "#05a4ff"
                                  : ["json", "js"].includes(
                                      data?.name?.split(".").pop()
                                    )
                                  ? "#fbc924"
                                  : [
                                      "png",
                                      "svg",
                                      "jpeg",
                                      "gif",
                                      "jpg",
                                      "eps",
                                      "ico",
                                    ].includes(data?.name?.split(".").pop())
                                  ? "#38a403"
                                  : [
                                      "woff",
                                      "woff2",
                                      "otf",
                                      "ttf",
                                      "txt",
                                    ].includes(data?.name?.split(".").pop())
                                  ? "#000000"
                                  : "#ececec",
                              }}
                              icon={
                                ["html", "htm"].includes(
                                  data?.name?.split(".").pop()
                                )
                                  ? faHtml5
                                  : ["css", "less", "sass", "scss"].includes(
                                      data?.name?.split(".").pop()
                                    )
                                  ? faCss3Alt
                                  : ["json", "js"].includes(
                                      data?.name?.split(".").pop()
                                    )
                                  ? faJsSquare
                                  : [
                                      "png",
                                      "svg",
                                      "jpeg",
                                      "gif",
                                      "jpg",
                                      "eps",
                                      "ico",
                                    ].includes(data?.name?.split(".").pop())
                                  ? faImage
                                  : [
                                      "woff",
                                      "woff2",
                                      "otf",
                                      "ttf",
                                      "txt",
                                    ].includes(data?.name?.split(".").pop())
                                  ? faFont
                                  : faSquare
                              }
                            />
                            <Typography
                              style={{
                                fontSize: "11px",
                                fontWeight: 400,
                                marginLeft: "0.5em",
                              }}
                            >
                              {data?.name}
                            </Typography>
                          </div>
                        )
                    )}
                  </div>
                  <Divider style={{ margin: "16px 0" }} />
                  <div style={{ padding: "0 1em" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <a
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "0.2em",
                          color: "#eb2f96",
                        }}
                        href={!_.isEmpty(links) && Object.values(links[0])[1]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkOutlined style={{ marginRight: "0.2em" }} />
                        <Typography.Text
                          style={{
                            fontSize: "12px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            color: "#eb2f96",
                          }}
                        >
                          Updated File
                        </Typography.Text>
                      </a>
                      <Typography
                        style={{ fontSize: "10px", color: "#947bb7" }}
                      >{`${
                        _.filter(
                          _.sortBy(platform[1], (o) => o.name)?.map(
                            (data) =>
                              data?.name !== "__platform_preview.html" &&
                              data?.name !== "" &&
                              data?.name
                          ),
                          (fil) => fil !== false
                        ).length
                      } Files`}</Typography>
                    </div>

                    {_.sortBy(platform[1], (o) => o.name)?.map(
                      (data, index) =>
                        data?.name !== "__platform_preview.html" &&
                        data?.name !== "" && (
                          <div
                            key={index}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FontAwesomeIcon
                              style={{
                                color: ["html", "htm"].includes(
                                  data?.name?.split(".").pop()
                                )
                                  ? "#ff6505"
                                  : ["css", "less", "sass", "scss"].includes(
                                      data?.name?.split(".").pop()
                                    )
                                  ? "#05a4ff"
                                  : ["json", "js"].includes(
                                      data?.name?.split(".").pop()
                                    )
                                  ? "#fbc924"
                                  : [
                                      "png",
                                      "svg",
                                      "jpeg",
                                      "gif",
                                      "jpg",
                                      "eps",
                                      "ico",
                                    ].includes(data?.name?.split(".").pop())
                                  ? "#38a403"
                                  : [
                                      "woff",
                                      "woff2",
                                      "otf",
                                      "ttf",
                                      "txt",
                                    ].includes(data?.name?.split(".").pop())
                                  ? "#000000"
                                  : "#ececec",
                              }}
                              icon={
                                ["html", "htm"].includes(
                                  data?.name?.split(".").pop()
                                )
                                  ? faHtml5
                                  : ["css", "less", "sass", "scss"].includes(
                                      data?.name?.split(".").pop()
                                    )
                                  ? faCss3Alt
                                  : ["json", "js"].includes(
                                      data?.name?.split(".").pop()
                                    )
                                  ? faJsSquare
                                  : [
                                      "png",
                                      "svg",
                                      "jpeg",
                                      "gif",
                                      "jpg",
                                      "eps",
                                      "ico",
                                    ].includes(data?.name?.split(".").pop())
                                  ? faImage
                                  : [
                                      "woff",
                                      "woff2",
                                      "otf",
                                      "ttf",
                                      "txt",
                                    ].includes(data?.name?.split(".").pop())
                                  ? faFont
                                  : faSquare
                              }
                            />
                            <Typography
                              style={{
                                fontSize: "11px",
                                fontWeight: 400,
                                marginLeft: "0.5em",
                              }}
                            >
                              {data?.name}
                            </Typography>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </Sider>
              <Content
                style={{
                  padding: "0 24px",
                  minHeight: 280,
                }}
              >
                <div>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {_.sortBy(codeChecker, (o) => o.name).map(
                      (codeCheck, index) => (
                        <Collapse
                          bordered={false}
                          key={index}
                          defaultActiveKey={["0"]}
                        >
                          <Panel
                            header={codeCheck?.name}
                            key={index}
                            extra={
                              codeCheck?.details?.removed !==
                              codeCheck?.details?.added ? (
                                <Tooltip
                                  placement="left"
                                  title={`${codeCheck?.details?.removed} Removed, ${codeCheck?.details?.added} Added`}
                                >
                                  <CloseCircleTwoTone twoToneColor="#eb2f96" />
                                </Tooltip>
                              ) : (
                                <Tooltip placement="left" title={"Identical"}>
                                  <CheckCircleTwoTone twoToneColor="#52c41a" />
                                </Tooltip>
                              )
                            }
                          >
                            <Row style={{ marginBottom: "1em" }}>
                              <Col span={12}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        marginRight: "1em",
                                        fontSize: "13px",
                                        color: "#747474",
                                      }}
                                    >
                                      {`${
                                        codeCheck?.details?.lines
                                          ?.slice(-1)
                                          ?.pop()?.right?.line
                                      } Lines`}
                                    </Typography>
                                    <Tag color="magenta">{`${codeCheck?.details?.removed} Removed`}</Tag>
                                  </div>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                    }}
                                  >
                                    <Typography
                                      style={{
                                        marginRight: "1em",
                                        fontSize: "13px",
                                        color: "#747474",
                                      }}
                                    >
                                      {`${
                                        codeCheck?.details?.lines
                                          ?.slice(-1)
                                          ?.pop()?.right?.line
                                      } Lines`}
                                    </Typography>
                                    <Tag color="success">{`${codeCheck?.details?.added} Additions`}</Tag>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: codeCheck?.code ?? "No message found",
                              }}
                            ></div>
                          </Panel>
                        </Collapse>
                      )
                    )}
                  </Space>
                </div>
              </Content>
            </Layout>
          </Content>
        </FadeIn>
      )}
    </Layout>
  );
}
