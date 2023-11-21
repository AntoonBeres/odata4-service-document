/* eslint-disable @typescript-eslint/no-unused-vars */
import { Edm } from 'odata4-metadata';
import { ServiceMetadata } from 'odata4-service-metadata';
import { JsonDocument } from './JsonDocument';
import { Request, Response, RequestHandler } from 'express';

export class ServiceDocument extends ServiceMetadata {
  constructor(edmx: Edm.Edmx, options?: object) {
    super(edmx, options);
  }

  document(format?: string) {
    switch (format) {
      case 'xml':
        throw new Error('Not implemented');
      default:
        return this.data;
    }
  }

  process(edmx: Edm.Edmx, options?: object) {
    const jsonDocument = new JsonDocument(options, edmx);
    this.data = jsonDocument.processMetadata();
  }

  requestHandler(format?: string) {
    return (req: Request, res: Response, next: RequestHandler) => {
      res.set('OData-Version', '4.0');

      const data = this.document(format);
      if (!data['@odata.context']) {
        let url = req.protocol + '://' + req.get('host') + req.originalUrl.split('?').shift();
        if (url.slice(-1) !== '/') url += '/';
        data['@odata.context'] = url + '$metadata';
      }

      res.json(data);
    };
  }
}
