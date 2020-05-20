import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form, Select } from 'antd';
import './EditableTable.css';

const FormItem = Form.Item;
const Option = Select.Option;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  state = {
    editing: false
  };

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = e => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `${title} is required.`
                      }
                    ],
                    initialValue: record[dataIndex]
                  })(
                    <Input
                      ref={node => (this.input = node)}
                      onPressEnter={this.save}
                    />
                  )}
                </FormItem>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  style={{ paddingRight: 24 }}
                  onClick={this.toggleEdit}
                >
                  {restProps.children}
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '是否为玻璃',
        dataIndex: 'glassflag',
        render: (text, rec) => {
          return (
            <Select
              defaultValue="1"
              onChange={value => {
                const tableData = this.state.dataSource;
                let newData = tableData;

                newData[rec.key - 1] = {
                  ...tableData[rec.key - 1],
                  glassflag: value
                };
                this.setState({
                  dataSource: newData
                });
                console.log('glassflag');
                console.log(this.state.dataSource);
                console.log('glassflag');
              }}
            >
              <Option value="1">玻璃</Option>
              <Option value="2">非玻璃</Option>
            </Select>
          );
        }
      },
      {
        title: '产品名称',
        dataIndex: 'product_name',
        render: (text, rec) => {
          return (
            <Input
              onChange={e => {
                console.log(e);
                const tableData = this.state.dataSource;
                let newData = tableData;

                newData[rec.key - 1] = {
                  ...tableData[rec.key - 1],
                  product_name: e.target.value
                };
                this.setState({
                  dataSource: newData
                });
                console.log('product_name');
                console.log(this.state.dataSource);
                console.log('product_name');
              }}
            />
          );
        }
      },
      {
        title: '规格型号',
        dataIndex: 'format',
        render: (text, rec) => {
          return (
            <Input
              onChange={e => {
                const tableData = this.state.dataSource;
                let newData = tableData;

                newData[rec.key - 1] = {
                  ...tableData[rec.key - 1],
                  format: e.target.value
                };
                this.setState({
                  dataSource: newData
                });
                console.log('format');
                console.log(this.state.dataSource);
                console.log('format');
              }}
            />
          );
        }
      },
      {
        title: '单位',
        dataIndex: 'unit',
        render: (text, rec) => {
          return (
            <Input
              onChange={e => {
                const tableData = this.state.dataSource;
                let newData = tableData;

                newData[rec.key - 1] = {
                  ...tableData[rec.key - 1],
                  unit: e.target.value
                };
                this.setState({
                  dataSource: newData
                });
                console.log('unit');
                console.log(this.state.dataSource);
                console.log('unit');
              }}
            />
          );
        }
      },
      {
        title: '数量',
        dataIndex: 'amount',
        render: (text, rec) => {
          return (
            <Input
              onChange={e => {
                const tableData = this.state.dataSource;
                let newData = tableData;

                newData[rec.key - 1] = {
                  ...tableData[rec.key - 1],
                  amount: e.target.value
                };
                this.setState({
                  dataSource: newData
                });
                console.log('amount');
                console.log(this.state.dataSource);
                console.log('amount');
              }}
            />
          );
        }
      },
      {
        title: '单价',
        dataIndex: 'unit_price',
        render: (text, rec) => {
          return (
            <Input
              onChange={e => {
                const tableData = this.state.dataSource;
                let newData = tableData;

                newData[rec.key - 1] = {
                  ...tableData[rec.key - 1],
                  unit_price: e.target.value
                };
                this.setState({
                  dataSource: newData
                });
                console.log('unit_price');
                console.log(this.state.dataSource);
                console.log('unit_price');
              }}
            />
          );
        }
      },
      {
        title: '不含税金额',
        dataIndex: 'notax_price',
        render: (text, rec) => {
          return (
            <Input
              onChange={e => {
                const tableData = this.state.dataSource;
                let newData = tableData;

                newData[rec.key - 1] = {
                  ...tableData[rec.key - 1],
                  notax_price: e.target.value
                };
                this.setState({
                  dataSource: newData
                });
                console.log('notax_price');
                console.log(this.state.dataSource);
                console.log('notax_price');
              }}
            />
          );
        }
      },
      {
        title: '税率',
        dataIndex: 'tax_rate',
        render: (text, rec) => {
          return (
            <Input
              onChange={e => {
                const tableData = this.state.dataSource;
                let newData = tableData;

                newData[rec.key - 1] = {
                  ...tableData[rec.key - 1],
                  tax_rate: e.target.value
                };
                this.setState({
                  dataSource: newData
                });
                console.log('tax_rate');
                console.log(this.state.dataSource);
                console.log('tax_rate');
              }}
            />
          );
        }
      },
      {
        title: '税额',
        dataIndex: 'tax',
        render: (text, rec) => {
          return (
            <Input
              onChange={e => {
                const tableData = this.state.dataSource;
                let newData = tableData;

                newData[rec.key - 1] = {
                  ...tableData[rec.key - 1],
                  tax: e.target.value
                };
                this.setState({
                  dataSource: newData
                });
                console.log('tax');
                console.log(this.state.dataSource);
                console.log('tax');
              }}
            />
          );
        }
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => this.handleDelete(record.key)}
            >
              <a href="javascript:;">Delete</a>
            </Popconfirm>
          ) : null
      }
    ];

    this.state = {
      dataSource: [],
      count: 1
    };
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    const newData = dataSource.filter(item => item.key !== key);
    this.setState({ dataSource: newData });
    this.props.getSaveDetail(newData);
  };

  handleAdd = () => {
    const _this = this;
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      glassflag: '1',
      product_name: '',
      format: '',
      unit: '',
      amount: '',
      unit_price: '',
      notax_price: '',
      tax_rate: '',
      tax: ''
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ dataSource: newData });
    this.props.getSaveDetail(newData);
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <div>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          添加明细
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}
