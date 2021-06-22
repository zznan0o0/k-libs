import React, { useState, useRef } from 'react';
import {Modal, Form } from 'antd';

let showModal;

export default (props) => {
  const formRef = useRef();
  const [visible, setVisible] = useState(false);

  showModal = (isShow=true) => {
    setVisible(isShow);
  }

  const onCancel = () => {
    setVisible(false);
  }

  const onOk = () => {
    formRef.current.validateFields().then(async (value) => {
      props.submit(value);
    }).catch(e => e);
  }

  return (
    <div>
      <Modal
        visible={visible}
        title={props.title || '操作'}
        centered
        onOk={onOk}
        onCancel={onCancel}
        maskClosable={false}
        destroyOnClose={true}
        preserve={false}
      >
        <Form ref={formRef} name={props.name || ''} labelCol={{ span: 4 }} initialValues={props.initialValues || {}}>
          {props.children}
        </Form>
      </Modal>
    </div>
  );
};

export {showModal};