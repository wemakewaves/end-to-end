import path from 'path';
export const port = process.env.PORT || 3000;
export const staticPath = path.resolve(__dirname, '..', 'static');
export const rootDir = path.resolve(__dirname, '..');
export const apiPath = 'http://end-to-end-api.herokuapp.com';

export const head = {
  titleTemplate: 'EndtoEnd.fm: %s',
  meta: [
    { name: 'description', content: 'EndtoEnd.fm is a podcast discussing the journey of digital products, from requirements gathering, development to deployment.' },
    { charset: 'utf-8' }
  ]
};
