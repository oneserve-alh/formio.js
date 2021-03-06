import assert from 'power-assert';

import Harness from '../../../test/harness';
import EditGridComponent from './EditGrid';
import { comp1, comp3, comp4 } from './fixtures';
import Webform from '../../Webform';
import { displayAsModalEditGrid } from '../../../test/formtest';

describe('EditGrid Component', () => {
  it('Should set correct values in dataMap inside editGrid and allow aditing them', (done) => {
    Harness.testCreate(EditGridComponent, comp4).then((component) => {
      component.setValue([{ dataMap: { key111: '111' } }]);

      setTimeout(()=>{
        const clickEvent = new Event('click');
        const editBtn = component.element.querySelector('.editRow');

        editBtn.dispatchEvent(clickEvent);

        setTimeout(()=>{
          const keyValue = component.element.querySelectorAll('[ref="input"]')[0].value;
          const valueValue = component.element.querySelectorAll('[ref="input"]')[1].value;
          const saveBtnsQty = component.element.querySelectorAll('[ref="editgrid-editGrid-saveRow"]').length;

          assert.equal(saveBtnsQty, 1);
          assert.equal(keyValue, 'key111');
          assert.equal(valueValue, '111');
          done();
        }, 500);
      }, 200);
    });
  });

  it('Should display saved values if there are more then 1 nested components', (done) => {
    Harness.testCreate(EditGridComponent, comp3).then((component) => {
      component.setValue([{ container: { number: 55555 } }, { container: { number: 666666 } }]);

      setTimeout(()=>{
        const firstValue = component.element.querySelectorAll('[ref="editgrid-editGrid-row"]')[0].querySelector('.col-sm-2').textContent.trim();
        const secondValue = component.element.querySelectorAll('[ref="editgrid-editGrid-row"]')[1].querySelector('.col-sm-2').textContent.trim();

        assert.equal(firstValue, '55555');
        assert.equal(secondValue, '666666');
        done();
      }, 600);
    });
  });

  it('Should build an empty edit grid component', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(1)', 'Field 1');
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(2)', 'Field 2');
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '0');
      Harness.testElements(component, 'li.list-group-header', 1);
      Harness.testElements(component, 'li.list-group-item', 1);
      Harness.testElements(component, 'li.list-group-footer', 0);
      Harness.testElements(component, 'div.editRow', 0);
      Harness.testElements(component, 'div.removeRow', 0);
      assert.equal(component.refs[`${component.editgridKey}-addRow`].length, 1);
      assert(component.checkValidity(component.getValue()), 'Item should be valid');
    });
  });

  it('Should build an edit grid component', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(1)', 'Field 1');
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(2)', 'Field 2');
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '0');
      Harness.testSetGet(component, [
        {
          field1: 'good',
          field2: 'foo'
        },
        {
          field1: 'good',
          field2: 'bar'
        }
      ]);
      Harness.testElements(component, 'li.list-group-header', 1);
      Harness.testElements(component, 'li.list-group-item', 3);
      Harness.testElements(component, 'li.list-group-footer', 0);
      Harness.testElements(component, 'div.editRow', 2);
      Harness.testElements(component, 'div.removeRow', 2);
      assert.equal(component.refs[`${component.editgridKey}-addRow`].length, 1);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(2) div.row div:nth-child(1)', 'good');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(2) div.row div:nth-child(2)', 'foo');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(3) div.row div:nth-child(1)', 'good');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(3) div.row div:nth-child(2)', 'bar');
      assert(component.checkValidity(component.getValue()), 'Item should be valid');
    });
  });

  it('Should add a row when add another is clicked', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.testElements(component, 'li.list-group-item', 1);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '0');
      Harness.clickElement(component, component.refs[`${component.editgridKey}-addRow`][0]);
      Harness.testElements(component, 'li.list-group-item', 2);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '0');
      Harness.clickElement(component, component.refs[`${component.editgridKey}-addRow`][0]);
      Harness.testElements(component, 'li.list-group-item', 3);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '0');
      assert(!component.checkValidity(component.getValue(), true), 'Item should not be valid');
    });
  });

  it('Should save a new row when save is clicked', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      component.pristine = false;
      Harness.testSetGet(component, [
        {
          field1: 'good',
          field2: 'foo'
        },
        {
          field1: 'good',
          field2: 'bar'
        }
      ]);
      Harness.testElements(component, 'li.list-group-item', 3);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
      Harness.clickElement(component, component.refs[`${component.editgridKey}-addRow`][0]);
      Harness.testElements(component, 'li.list-group-item', 4);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
      Harness.setInputValue(component, 'data[editgrid][2][field1]', 'good');
      Harness.setInputValue(component, 'data[editgrid][2][field2]', 'baz');
      Harness.clickElement(component, 'div.editgrid-actions button.btn-primary');
      Harness.testElements(component, 'li.list-group-item', 4);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '3');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(4) div.row div:nth-child(1)', 'good');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(4) div.row div:nth-child(2)', 'baz');
      assert(component.checkValidity(component.getValue()), 'Item should be valid');
    });
  });

  it('Should cancel add a row when cancel is clicked', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.testSetGet(component, [
        {
          field1: 'good',
          field2: 'foo'
        },
        {
          field1: 'good',
          field2: 'bar'
        }
      ]);
      Harness.testElements(component, 'li.list-group-item', 3);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
      Harness.clickElement(component, component.refs[`${component.editgridKey}-addRow`][0]);
      Harness.testElements(component, 'li.list-group-item', 4);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
      Harness.setInputValue(component, 'data[editgrid][2][field1]', 'good');
      Harness.setInputValue(component, 'data[editgrid][2][field2]', 'baz');
      Harness.clickElement(component, 'div.editgrid-actions button.btn-danger');
      Harness.testElements(component, 'li.list-group-item', 3);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
      assert.equal(component.editRows.length, 2);
      assert(component.checkValidity(component.getValue(), true), 'Item should be valid');
    });
  });

  it('Should delete a row when delete is clicked', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.testSetGet(component, [
        {
          field1: 'good',
          field2: 'foo'
        },
        {
          field1: 'good',
          field2: 'bar'
        },
        {
          field1: 'good',
          field2: 'baz'
        }
      ]);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '3');
      Harness.clickElement(component, 'li.list-group-item:nth-child(3) div.removeRow');
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(2) div.row div:nth-child(1)', 'good');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(2) div.row div:nth-child(2)', 'foo');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(3) div.row div:nth-child(1)', 'good');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(3) div.row div:nth-child(2)', 'baz');
      assert(component.checkValidity(component.getValue(), true), 'Item should be valid');
    });
  });

  it('Should edit a row when edit is clicked', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.testSetGet(component, [
        {
          field1: 'good',
          field2: 'foo'
        },
        {
          field1: 'good',
          field2: 'bar'
        }
      ]);
      Harness.clickElement(component, 'li.list-group-item:nth-child(3) div.editRow');
      Harness.getInputValue(component, 'data[editgrid][1][field1]', 'good');
      Harness.getInputValue(component, 'data[editgrid][1][field2]', 'bar');
      Harness.testElements(component, 'div.editgrid-actions button.btn-primary', 1);
      Harness.testElements(component, 'div.editgrid-actions button.btn-danger', 1);
      assert(!component.checkValidity(component.getValue(), true), 'Item should not be valid');
    });
  });

  it('Should save a row when save is clicked', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.testSetGet(component, [
        {
          field1: 'good',
          field2: 'foo'
        },
        {
          field1: 'good',
          field2: 'bar'
        }
      ]);
      Harness.clickElement(component, 'li.list-group-item:nth-child(3) div.editRow');
      Harness.setInputValue(component, 'data[editgrid][1][field2]', 'baz');
      Harness.clickElement(component, 'div.editgrid-actions button.btn-primary');
      Harness.testElements(component, 'li.list-group-item', 3);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(3) div.row div:nth-child(1)', 'good');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(3) div.row div:nth-child(2)', 'baz');
      assert(component.checkValidity(component.getValue(), true), 'Item should be valid');
    });
  });

  it('Should cancel edit row when cancel is clicked', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.testSetGet(component, [
        {
          field1: 'good',
          field2: 'foo'
        },
        {
          field1: 'good',
          field2: 'bar'
        }
      ]);
      Harness.clickElement(component, 'li.list-group-item:nth-child(3) div.editRow');
      Harness.setInputValue(component, 'data[editgrid][1][field2]', 'baz');
      Harness.clickElement(component, 'div.editgrid-actions button.btn-danger');
      Harness.testElements(component, 'li.list-group-item', 3);
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(3) div.row div:nth-child(1)', 'good');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(3) div.row div:nth-child(2)', 'bar');
      assert(component.checkValidity(component.getValue(), true), 'Item should be valid');
    });
  });

  it('Should show error messages for existing data in rows', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.testSetGet(component, [
        {
          field1: 'bad',
          field2: 'foo'
        },
        {
          field1: 'good',
          field2: 'bar'
        },
        {
          field1: 'also bad',
          field2: 'baz'
        }
      ]);
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(2) div.has-error div.editgrid-row-error', 'Must be good');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(4) div.has-error div.editgrid-row-error', 'Must be good');
      assert(!component.checkValidity(component.getValue(), true), 'Item should not be valid');
    });
  });

  it('Should not allow saving when errors exist', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.clickElement(component, 'button.btn-primary');
      Harness.clickElement(component, 'div.editgrid-actions button.btn-primary');
      Harness.getInputValue(component, 'data[editgrid][0][field1]', '');
      Harness.getInputValue(component, 'data[editgrid][0][field2]', '');
      assert(!component.checkValidity(component.getValue(), true), 'Item should not be valid');
      Harness.setInputValue(component, 'data[editgrid][0][field2]', 'baz');
      Harness.clickElement(component, 'div.editgrid-actions button.btn-primary');
      Harness.getInputValue(component, 'data[editgrid][0][field1]', '');
      Harness.getInputValue(component, 'data[editgrid][0][field2]', 'baz');
      assert(!component.checkValidity(component.getValue(), true), 'Item should not be valid');
      Harness.setInputValue(component, 'data[editgrid][0][field1]', 'bad');
      Harness.clickElement(component, 'div.editgrid-actions button.btn-primary');
      Harness.getInputValue(component, 'data[editgrid][0][field1]', 'bad');
      Harness.getInputValue(component, 'data[editgrid][0][field2]', 'baz');
      assert(!component.checkValidity(component.getValue(), true), 'Item should not be valid');
      Harness.setInputValue(component, 'data[editgrid][0][field1]', 'good');
      Harness.clickElement(component, 'div.editgrid-actions button.btn-primary');
      assert(component.checkValidity(component.getValue(), true), 'Item should be valid');
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '1');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(2) div.row div:nth-child(1)', 'good');
      Harness.testInnerHtml(component, 'li.list-group-item:nth-child(2) div.row div:nth-child(2)', 'baz');
    });
  });

  it('Should not allow saving when rows are open', () => {
    return Harness.testCreate(EditGridComponent, comp1).then((component) => {
      Harness.testSetGet(component, [
        {
          field1: 'good',
          field2: 'foo'
        },
        {
          field1: 'good',
          field2: 'bar'
        }
      ]);
      Harness.clickElement(component, 'li.list-group-item:nth-child(3) div.editRow');
      assert(!component.checkValidity(component.getValue(), true), 'Item should not be valid');
      Harness.clickElement(component, 'div.editgrid-actions button.btn-primary');
      assert(component.checkValidity(component.getValue(), true), 'Item should be valid');
      Harness.clickElement(component, 'li.list-group-item:nth-child(3) div.editRow');
      assert(!component.checkValidity(component.getValue(), true), 'Item should not be valid');
      Harness.clickElement(component, 'div.editgrid-actions button.btn-danger');
      assert(component.checkValidity(component.getValue(), true), 'Item should be valid');
    });
  });

  it('Should disable components when in read only', () => {
    return Harness.testCreate(EditGridComponent, comp1, { readOnly: true }).then((component) => {
      Harness.testSetGet(component, [
        {
          field1: 'good',
          field2: 'foo'
        },
        {
          field1: 'good',
          field2: 'bar'
        }
      ]);
      Harness.clickElement(component, 'li.list-group-item:nth-child(3) div.removeRow');
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
      Harness.clickElement(component, 'li.list-group-item:nth-child(3) div.editRow');
      Harness.testInnerHtml(component, 'li.list-group-header div.row div:nth-child(3)', '2');
    });
  });

  describe('Display As Modal', () => {
    it('Should show errors on save', (done) => {
      const formElement = document.createElement('div');
      const form = new Webform(formElement);
      form.setForm(displayAsModalEditGrid).then(() => {
          const editGrid = form.components[0];
          const clickEvent = new Event('click');
          editGrid.addRow();
          setTimeout(() => {
            const dialog = document.querySelector('[ref="dialogContents"]');
            const saveButton = dialog.querySelector('.btn.btn-primary');
            saveButton.dispatchEvent(clickEvent);
            setTimeout(() => {
              assert.equal(editGrid.errors.length, 6);
              done();
            }, 100);
          }, 100);
      }).catch(done);
    });

    it('Should show add error classes to invalid components', (done) => {
      const formElement = document.createElement('div');
      const form = new Webform(formElement);
      form.setForm(displayAsModalEditGrid).then(() => {
        const editGrid = form.components[0];
        const clickEvent = new Event('click');
        editGrid.addRow();
        setTimeout(() => {
          const dialog = document.querySelector('[ref="dialogContents"]');
          const saveButton = dialog.querySelector('.btn.btn-primary');
          saveButton.dispatchEvent(clickEvent);
          setTimeout(() => {
            const components = Array.from(dialog.querySelectorAll('[ref="component"]'));
            const areRequiredComponentsHaveErrorWrapper = components.every((comp) => {
              const { className } = comp;
              return (className.includes('required') && className.includes('formio-error-wrapper')) || true;
            });
            assert.equal(areRequiredComponentsHaveErrorWrapper, true);
            done();
          }, 100);
        }, 100);
      }).catch(done);
    });
  });

  // TODO: Need to fix editing rows and conditionals.
  // it('Should calculate conditional logic and default values when adding row', () => {
  //   return Harness.testCreate(EditGridComponent, comp2).then(component => {
  //     Harness.clickElement(component, component.refs[`${component.editgridKey}-addRow`][0]);
  //     Harness.testVisibility(component, '.formio-component-field2', false);
  //     Harness.getInputValue(component, 'data[editgrid][0][field1]', 'bar');
  //   });
  // });
});
