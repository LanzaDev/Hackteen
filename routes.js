import fs from 'fs';
export default function route(req, res, data) {
  res.setHeader('Content-type', 'application/json', 'utf-8');

  if (req.method === 'GET' && req.url === '/') {
    const { content } = data;

    res.statusCode = 200;
    const response = {
      message: content
    };

    res.end(JSON.stringify(response));
    return;
  }

  if (req.method === 'PUT' && req.url === '/files') {
    const body = [];

    req.on('data', (part) => {
      body.push(part);
    });

    req.on('end', () => {
      const file = JSON.parse(body);
      res.statusCode = 400;

      if (!file?.name) {
        const response = {
          error: {
            message: 'the "name" attribute was not found. This is a required attribute.'
          }
        };

        res.end(JSON.stringify(response));
        return;
      }

      fs.writeFile(`${file.name}.txt`, file?.content ?? '', 'utf-8', (error) => {
        if (error) {
          console.log('failed to create file', error);
          res.statusCode = 500;

          const response = {
            error: {
              message: `failed to create file ${file.name}`
            }
          };

          res.end(JSON.stringify(response));
          return;
        }

        res.statusCode = 201;
        const response = {
          message: `file ${file.namme} generated successfully`
        };

        res.end(JSON.stringify(response));
        return;
      });
    });

    req.on('error', (error) => {
      console.log('failed to process the request', error);
      res.statusCode = 400;
      const response = {
        error: {
          message: 'failed to process the request'
        }
      };
      res.end(JSON.stringify(response));
      return;
    });
    return;
  };

  res.statusCode = 404;
  const response = {
    error: {
      message: 'route not found',
      url: req.url
    }
  };
  res.end(JSON.stringify(response));
}