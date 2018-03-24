const root = document.getElementById('root');
const model = {
  input: m.stream(''),
  result: [],
  list: [],
  isDuplicate: m.stream(true),
  number: m.stream(1),
  setList: (input) => {
    model.list = input.split("\n").filter((v) => { return v.trim(); });
  },
  execute: () => {
    model.result.length = 0;
    const list = model.list.slice();
    for (let i = 0; i < model.number; i++) {
      if (list.length < 1) {
        break;
      }
      const index = execRandom(list.length);
      model.result.push(list[index]);
      if (!model.isDuplicate()) {
        list.splice(index, 1);
      }
    }
  },
  reset: () => {
    model.result.length = 0;
    model.list.length = 0;
    model.input('');
  }
};
function execRandom(max) {
  const buff = new Uint16Array(1);
  const rand = window.crypto.getRandomValues(buff)[0] / 65536;
  return Math.floor(rand * max);
}
const Component = {
  view: () => {
    return [
      m('h1', 'Choose at Random'),
      m('.container', [
        m('.input-area', [
          m('.controls', [
            m('label', [
              '回数：',
              m('input.num[type=number]', {
                type: 'number',
                value: model.number(),
                onchange: m.withAttr('value', model.number)
              })
            ]),
            m('label', [
              'リスト長：',
              m('input.length[type=number]', {
                readonly: 'readonly',
                disabled: 'disabled',
                value: model.list.length
              })
            ]),
            m('label', [
              '重複：',
              m('input[type=checkbox]', {
                onchange: m.withAttr('checked', model.isDuplicate),
                checked: model.isDuplicate()
              })
            ]),
            m('button', {
              onclick: (e) => {
                e.preventDefault();
                model.execute();
              }
            }, 'EXEC'),
            m('button', {
              onclick: (e) => {
                e.preventDefault();
                model.reset();
              }
            }, 'RESET')
          ]),
          m('.list-edit', [
            m('textarea.list-text', {
              placeholder: 'input item list',
              onkeyup: m.withAttr("value", (value) => {
                model.input(value);
                model.setList(model.input());
              })
            }, model.input()),
            m('ul.item-list', model.list.map((item) => {
              return m('li', item)
            }))
          ])
        ]),
        m('.output-area', [
          m('h2', 'RESULT'),
          m('.result', [
            m('textarea', {
              readonly: 'readonly'
            }, model.result.join("\n"))
          ])
        ])
      ])
    ];
  }
}

m.mount(root, Component);
