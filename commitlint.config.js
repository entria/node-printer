module.exports = {
  extends: [ '@commitlint/config-conventional' ],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'revert',
        'config',
        'chore',
      ],
    ],
    'type-empty': [ 2, 'never' ],
    'subject-empty': [ 2, 'never' ],
    'subject-full-stop': [ 0, 'never' ],
    'subject-case': [ 0, 'never' ],
  },
};
