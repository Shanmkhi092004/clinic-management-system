import * as ui from '../../ui/ui.js';

describe('UI Module', () => {
  test('showModal displays modal', () => {
    document.body.innerHTML = '<div id="modal1" style="display:none"></div>';
    ui.showModal('modal1');
    expect(document.getElementById('modal1').style.display).toBe('block');
  });

  test('hideModal hides modal', () => {
    document.body.innerHTML = '<div id="modal2" style="display:block"></div>';
    ui.hideModal('modal2');
    expect(document.getElementById('modal2').style.display).toBe('none');
  });

  test('renderMainSection sets HTML and displays', () => {
    document.body.innerHTML = '<div id="main-section" style="display:none"></div>';
    ui.renderMainSection('<p>Hello</p>');
    const main = document.getElementById('main-section');
    expect(main.innerHTML).toBe('<p>Hello</p>');
    expect(main.style.display).toBe('block');
  });
});
