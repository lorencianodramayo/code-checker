import React, { useEffect } from "react";

import { Divider, Form, Input, Typography } from "antd";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { requestPlatform } from "utils/store/reducer/platform";

import Loader from "components/Loader";

import team from "assets/images/team.svg";
import logo from "assets/images/smartly.svg";

import { validate } from "utils/helpers";
import _ from "lodash";

export default function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const link1Value = Form.useWatch("link1", form);
  const link2Value = Form.useWatch("link2", form);

  //  redux state
  const { codeId, isFetching } = useSelector((state) => state.platform);

  useEffect(() => {
    if (!_.isEmpty(link1Value) && !_.isEmpty(link2Value)) {
      dispatch(requestPlatform([link1Value, link2Value]));
    }

    !_.isNull(codeId) && navigate(`/code/${codeId}`);
  }, [link1Value, link2Value, codeId]);

  return (
    <>
      {isFetching && <Loader />}
      <div className="home">
        <img className="logo" src={logo} alt="smartly_logo" />
        <div className="container">
          <div className="wrapper">
            <Typography.Title
              level={1}
              style={{
                fontWeight: 700,
                margin: 0,
                padding: 0,
                color: "#1d1853",
              }}
            >
              QA
            </Typography.Title>
            <Typography.Title level={1} className="qa_tool_title">
              Code Checker
            </Typography.Title>
            <Typography.Title
              level={5}
              style={{ fontWeight: 500, margin: 0, padding: 0 }}
            >
              Powered by Ad-Lib.io and Diffchecker
            </Typography.Title>
            <Divider />
            <Form
              form={form}
              size="large"
              layout="vertical"
              requiredMark={true}
              autoComplete="off"
              initialValues={{
                link1: "",
                link2: "",
              }}
            >
              <Form.Item
                name="link1"
                label="Original template link"
                required
                tooltip="Select the correct variant in the platform before pasting."
              >
                <Input onKeyPress={(e) => validate(e)} allowClear />
              </Form.Item>
              <Form.Item
                name="link2"
                label="Updated template link"
                required
                tooltip="Select the correct variant in the platform before pasting."
              >
                <Input onKeyPress={(e) => validate(e)} allowClear />
              </Form.Item>
            </Form>
          </div>

          <img src={team} alt="team_logo" />
        </div>
      </div>
    </>
  );
}
