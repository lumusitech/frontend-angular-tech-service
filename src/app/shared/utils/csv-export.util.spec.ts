import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { exportToCsv } from './csv-export.util';

describe('exportToCsv', () => {
  let createObjectUrlSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectUrlSpy: ReturnType<typeof vi.spyOn>;
  let clickSpy: ReturnType<typeof vi.spyOn>;
  let downloadedName = '';

  beforeEach(() => {
    createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockReturnValue(undefined);
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      downloadedName = this.download;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function getBlobContent(): Promise<string> {
    const blob = createObjectUrlSpy.mock.calls[0][0] as Blob;
    return blob.text().then((t) => t.replace('\uFEFF', ''));
  }

  it('should create a blob with UTF-8 BOM and .csv extension', async () => {
    exportToCsv(
      'data',
      ['name', 'age'],
      [
        ['Ana', 30],
        ['Luis', 25],
      ],
    );

    const blob = createObjectUrlSpy.mock.calls[0][0] as Blob;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect(bytes.slice(0, 3)).toEqual(new Uint8Array([0xef, 0xbb, 0xbf]));
    expect(downloadedName).toBe('data.csv');
    expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);
  });

  it('should not duplicate the .csv extension when filename already has it', () => {
    exportToCsv('report.csv', ['name'], [['Ana']]);
    expect(downloadedName).toBe('report.csv');
  });

  it('should join headers and rows with commas and CRLF', async () => {
    exportToCsv(
      'data',
      ['name', 'age'],
      [
        ['Ana', 30],
        ['Luis', 25],
      ],
    );

    const content = await getBlobContent();
    const body = content.replace('\uFEFF', '');
    expect(body).toBe('name,age\r\nAna,30\r\nLuis,25');
  });

  it('should quote values containing commas, quotes or newlines and double inner quotes', async () => {
    exportToCsv('data', ['note'], [[`He said "hi", ok`], ['line1\nline2']]);

    const content = await getBlobContent();
    const body = content.replace('\uFEFF', '');
    expect(body).toContain(`"He said ""hi"", ok"`);
    expect(body).toContain('"line1\nline2"');
  });

  it('should not quote simple values', async () => {
    exportToCsv('data', ['name'], [['Ana']]);

    const content = await getBlobContent();
    const body = content.replace('\uFEFF', '');
    expect(body).toBe('name\r\nAna');
  });

  it('should coerce numbers and null values to strings', async () => {
    exportToCsv(
      'data',
      ['a', 'b'],
      [
        [0, null],
        [false, undefined],
      ],
    );

    const content = await getBlobContent();
    const body = content.replace('\uFEFF', '');
    expect(body).toContain('0,');
    expect(body).toContain('false,');
  });

  it('should use text/csv charset utf-8 as blob type', () => {
    exportToCsv('data', ['a'], [['b']]);

    const blob = createObjectUrlSpy.mock.calls[0][0] as Blob;
    expect(blob.type).toBe('text/csv;charset=utf-8');
  });

  it('should append link to body, click it and revoke the URL', () => {
    const appendChild = vi.spyOn(document.body, 'appendChild');
    const removeChild = vi.spyOn(document.body, 'removeChild');

    exportToCsv('data', ['a'], [['b']]);

    expect(appendChild).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeChild).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:mock-url');
  });
});
