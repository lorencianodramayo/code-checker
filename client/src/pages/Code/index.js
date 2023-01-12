import React, { useEffect, useRef, useState } from "react";

import FadeIn from "react-fade-in";

import { useNavigate } from "react-router-dom";

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

import {
  requestPlatformViaId,
  requestPlatform,
  ResetPlatform,
} from "utils/store/reducer/platform";

import {
  requestCodeCheck,
  initCodeChecker,
  ResetCodeChecker,
} from "utils/store/reducer/code";

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
  Form,
  Modal,
  Alert,
} from "antd";

import {
  CloseCircleTwoTone,
  CheckCircleTwoTone,
  LinkOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import logoMini from "assets/images/smartly-mini.svg";
import Loader from "components/Loader";
import { ReactCompareSlider } from "react-compare-slider";

import { validate } from "utils/helpers";

const { Panel } = Collapse;
const { Header, Content, Sider } = Layout;

export default function Code() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [sideOpen, setSideOpen] = useState(0);
  const [codeRange, setCodeRange] = useState(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [clicked, setClicked] = useState(false);

  const {
    platform,
    links,
    overview,
    codeId: codeCheckerId,
  } = useSelector((state) => state.platform);
  const { data: codeChecker } = useSelector((state) => state.code);

  const { codeId } = useParams();
  const mounted = useRef(true);

  const link1Value = Form.useWatch("link1", form);
  const link2Value = Form.useWatch("link2", form);

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
    setClicked(false);
    !_.isEmpty(platform) &&
      (platform[0][0]?.variant === "template_1"
        ? platform[0]
        : platform[1]
      ).map(
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
                platform[1][0]?.variant === "template_2"
                  ? platform[1]
                  : platform[0],
                (compare) => compare?.name === data?.name
              )?.code,
              diff_level: "word",
            })
          )
      );

    !_.isEmpty(platform) &&
      setCodeRange(
        _.filter(
          (platform[0][0]?.variant === "template_1"
            ? platform[0]
            : platform[1]
          ).map(
            (data) =>
              !_.isEmpty(data?.name) &&
              data?.name !== "__platform_preview.html" &&
              data?.name !== "" &&
              !_.isUndefined(data?.code)
          ),
          (fil) => fil === true
        )?.length === 0
          ? null
          : !_.isEmpty(platform) &&
              _.filter(
                (platform[0][0]?.variant === "template_1"
                  ? platform[0]
                  : platform[1]
                )?.map(
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

  useEffect(() => {
    if (!_.isEmpty(link1Value) && !_.isEmpty(link2Value)) {
      dispatch(requestPlatform([link1Value, link2Value]));
      dispatch(ResetCodeChecker());
      dispatch(ResetPlatform());
    }

    if (!_.isNull(codeCheckerId) && codeCheckerId !== codeId) {
      form.setFieldsValue({
        link1: "",
        link2: "",
      });
      navigate(`/code/${codeCheckerId}`);
    }
  }, [link1Value, link2Value, codeCheckerId]);

  const handleSearch = (_value) => setSearch(_value);

  return (
    <Layout className="code">
      {/* Search and Header */}
      <div className="header-wrapper">
        <Header className="header">
          <div>
            <img src={logoMini} alt="smartly mini" className="logo" />
            <Typography.Text className="title">Code Checker</Typography.Text>
          </div>
        </Header>

        <div
          style={{
            marginBottom: "0",
            display: "flex",
            justifyContent: "space-between",
            padding: "1em 3.1em",
          }}
        >
          <div style={{ display: "flex" }}>
            <Input
              placeholder="Search"
              style={{
                borderRadius: "3px",
                width: "200px",
                "&:active": {
                  borderColor: "#f7488b",
                },
                "&:hover": {
                  borderColor: "#f7488b",
                },
                "&:focus": {
                  borderColor: "#f7488b",
                },
              }}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <Button
              style={{
                borderRadius: "3px",
                backgroundColor: "#eb2f96",
                marginLeft: "8px",
              }}
              type="primary"
              icon={<InfoCircleOutlined />}
              onClick={() => setModalOpen(true)}
            />
          </div>
          <div style={{ display: "flex" }}>
            <Popover
              placement="bottomRight"
              content={
                <>
                  <Form
                    form={form}
                    layout="vertical"
                    requiredMark={true}
                    autoComplete="off"
                    initialValues={{
                      link1: "",
                      link2: "",
                    }}
                    style={{ width: "300px" }}
                  >
                    <Form.Item
                      name="link1"
                      label="Original template link"
                      required
                      tooltip="Select the correct variant in the platform before pasting."
                      style={{ marginBottom: "12px" }}
                    >
                      <Input
                        style={{ borderRadius: "3px" }}
                        onKeyPress={(e) => validate(e)}
                        allowClear
                      />
                    </Form.Item>
                    <Form.Item
                      name="link2"
                      label="Updated template link"
                      required
                      tooltip="Select the correct variant in the platform before pasting."
                      style={{ marginBottom: "12px" }}
                    >
                      <Input
                        style={{ borderRadius: "3px" }}
                        onKeyPress={(e) => validate(e)}
                        allowClear
                      />
                    </Form.Item>
                  </Form>
                </>
              }
              trigger="click"
              open={clicked}
              onOpenChange={() => setClicked((prev) => !prev)}
            >
              <Button
                style={{
                  borderRadius: "3px",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #5025c4",
                  color: "#5025c4",
                }}
                icon={<PlusOutlined />}
                type="outlined"
              >
                Generate New
              </Button>
            </Popover>
          </div>
        </div>
      </div>

      {codeRange !== codeChecker?.length || _.isEmpty(platform) ? (
        <Loader />
      ) : (
        <FadeIn>
          <Content
            style={{
              padding: "0px 50px 20px 50px",
              marginTop: "112px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #b3b3b3",
                backgroundColor: "#c3c3c3cc",
              }}
            >
              {!_.isEmpty(links) && (
                <ReactCompareSlider
                  style={{ display: "flex" }}
                  itemOne={
                    <>
                      <iframe
                        src={`${
                          Object.values(links[0])
                            ?.map((data) => data?.split("/").pop())
                            ?.map((data) =>
                              _.filter(overview, (d) => d?._id === data)
                            )[0][0]?.contentLocation
                        }/index.html`}
                        width={Number(
                          Object.values(links[0])
                            ?.map((data) => data?.split("/").pop())
                            ?.map((data) =>
                              _.filter(overview, (d) => d?._id === data)
                            )[0][0]
                            ?.size?.split("x")[0]
                        )}
                        height={Number(
                          Object.values(links[0])
                            ?.map((data) => data?.split("/").pop())
                            ?.map((data) =>
                              _.filter(overview, (d) => d?._id === data)
                            )[0][0]
                            ?.size?.split("x")[1]
                        )}
                        style={{ border: 0, backgroundColor: "#c3c3c3cc" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          display: "flex",
                          bottom: "1em",
                          margin: "0 auto",
                          width: "100%",
                          left: 0,
                          right: 0,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Tag
                          color="success"
                          style={{ borderRadius: "3px", margin: 0 }}
                        >
                          Original
                        </Tag>
                      </div>
                    </>
                  }
                  itemTwo={
                    <>
                      <iframe
                        src={`${
                          Object.values(links[0])
                            ?.map((data) => data?.split("/").pop())
                            ?.map((data) =>
                              _.filter(overview, (d) => d?._id === data)
                            )[1][0]?.contentLocation
                        }/index.html`}
                        width={Number(
                          Object.values(links[0])
                            ?.map((data) => data?.split("/").pop())
                            ?.map((data) =>
                              _.filter(overview, (d) => d?._id === data)
                            )[1][0]
                            ?.size?.split("x")[0]
                        )}
                        height={Number(
                          Object.values(links[0])
                            ?.map((data) => data?.split("/").pop())
                            ?.map((data) =>
                              _.filter(overview, (d) => d?._id === data)
                            )[1][0]
                            ?.size?.split("x")[1]
                        )}
                        style={{ border: 0, backgroundColor: "#c3c3c3cc" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          display: "flex",
                          bottom: "1em",
                          margin: "0 auto",
                          width: "100%",
                          left: 0,
                          right: 0,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Tag
                          color="error"
                          style={{ borderRadius: "3px", margin: 0 }}
                        >
                          Updated
                        </Tag>
                      </div>
                    </>
                  }
                ></ReactCompareSlider>
              )}
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
                        href={
                          !_.isEmpty(links)
                            ? Object.values(links[0])[0]
                            : undefined
                        }
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
                      >
                        {!_.isEmpty(platform) &&
                          `${
                            _.filter(
                              _.sortBy(
                                platform[0][0]?.variant === "template_1"
                                  ? platform[0]
                                  : platform[1],
                                (o) => o.name
                              )?.map(
                                (data) =>
                                  data?.name !== "__platform_preview.html" &&
                                  data?.name !== "" &&
                                  data?.name
                              ),
                              (fil) => fil !== false
                            ).length
                          } Files`}
                      </Typography>
                    </div>

                    {!_.isEmpty(platform) &&
                      _.filter(
                        _.sortBy(
                          platform[0][0]?.variant === "template_1"
                            ? platform[0]
                            : platform[1],
                          (o) => o?.name
                        ),
                        (f) =>
                          f?.name?.toLowerCase()?.includes(search.toLowerCase())
                      )?.map(
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
                              <Typography.Paragraph
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 400,
                                  margin: "4px 0px 4px 7px",
                                }}
                                ellipsis
                              >
                                {data?.name}
                              </Typography.Paragraph>
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
                        href={
                          !_.isEmpty(links)
                            ? Object.values(links[0])[1]
                            : undefined
                        }
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
                      >
                        {!_.isEmpty(platform) &&
                          `${
                            _.filter(
                              _.sortBy(
                                platform[1][0]?.variant === "template_2"
                                  ? platform[1]
                                  : platform[0],
                                (o) => o.name
                              )?.map(
                                (data) =>
                                  data?.name !== "__platform_preview.html" &&
                                  data?.name !== "" &&
                                  data?.name
                              ),
                              (fil) => fil !== false
                            ).length
                          } Files`}
                      </Typography>
                    </div>

                    {!_.isEmpty(platform) &&
                      _.filter(
                        _.sortBy(
                          platform[1][0]?.variant === "template_2"
                            ? platform[1]
                            : platform[0],
                          (o) => o?.name
                        ),
                        (f) =>
                          f?.name?.toLowerCase()?.includes(search.toLowerCase())
                      )?.map(
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
                              <Typography.Paragraph
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 400,
                                  margin: "4px 0px 4px 7px",
                                }}
                                ellipsis
                              >
                                {data?.name}
                              </Typography.Paragraph>
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
                    {_.filter(
                      _.sortBy(codeChecker, (o) => o?.name),
                      (f) =>
                        f?.name?.toLowerCase()?.includes(search.toLowerCase())
                    )?.map((codeCheck, index) => (
                      <Collapse
                        bordered={false}
                        key={index}
                        defaultActiveKey={["0"]}
                      >
                        <Panel
                          header={codeCheck?.name}
                          key={index}
                          extra={
                            codeCheck?.details?.removed !== 0 ||
                            codeCheck?.details?.added !== 0 ? (
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
                                        ?.pop()?.left?.line
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
                    ))}
                  </Space>
                </div>
              </Content>
            </Layout>
          </Content>
        </FadeIn>
      )}

      <Modal
        title="Template Overview"
        centered
        open={modalOpen}
        closable={false}
        footer={null}
        onCancel={() => setModalOpen(false)}
        width={1000}
      >
        <Divider style={{ margin: "14px 0" }} />
        <Row gutter={[24, 24]}>
          {!_.isEmpty(links) &&
            Object.values(links[0])
              ?.map((data) => data?.split("/").pop())
              ?.map((data) => _.filter(overview, (d) => d?._id === data))
              .map((t, index) => (
                <Col key={index} span={12}>
                  <div>
                    <Typography style={{ fontSize: "12px", fontWeight: 700 }}>
                      Template Name
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        marginTop: "4px",
                      }}
                    >
                      <Tag
                        color={index === 0 ? "success" : "error"}
                        style={{ marginRight: "1em" }}
                      >
                        {index === 0 ? "Original" : "Updated"}
                      </Tag>
                      <Typography.Paragraph ellipsis>
                        {t[0]?.name}
                      </Typography.Paragraph>
                    </div>
                  </div>
                  <Divider style={{ margin: "0 0 15px" }} />

                  <div>
                    <Typography style={{ fontSize: "12px", fontWeight: 700 }}>
                      Dimension
                    </Typography>
                    <Typography.Paragraph ellipsis>
                      {t[0]?.size}
                    </Typography.Paragraph>
                  </div>
                  <Divider style={{ margin: "0 0 15px" }} />
                  <div>
                    <Typography style={{ fontSize: "12px", fontWeight: 700 }}>
                      {`Dynamic Element (${t[0]?.dynamicElements?.length})`}
                    </Typography>
                    <div style={{ marginTop: "6px" }}>
                      {t[0]?.dynamicElements?.map((data, i) => (
                        <Tag
                          key={i}
                          style={{ margin: "0 0 4px 4px", borderRadius: "3px" }}
                        >
                          {data}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <Divider style={{ margin: "16px 0 15px" }} />
                  <div>
                    <Typography style={{ fontSize: "12px", fontWeight: 700 }}>
                      Dynamic Image Element Sizes{" "}
                      {_.isEmpty(t[0]?.dynamicImageElementSizes)
                        ? ""
                        : "(" +
                          Object.keys(t[0]?.dynamicImageElementSizes)?.length +
                          ")"}
                    </Typography>
                    <div style={{ marginTop: "6px" }}>
                      {_.isEmpty(t[0]?.dynamicImageElementSizes) ? (
                        <Alert message="No Value" type="warning" />
                      ) : (
                        Object.keys(t[0]?.dynamicImageElementSizes)?.map(
                          (data, i) => (
                            <Tag
                              key={i}
                              style={{
                                margin: "0 0 4px 4px",
                                borderRadius: "3px",
                              }}
                            >
                              {`${data}: ${t[0]?.dynamicImageElementSizes[data]}`}
                            </Tag>
                          )
                        )
                      )}
                    </div>
                  </div>
                </Col>
              ))}
        </Row>
      </Modal>
    </Layout>
  );
}
