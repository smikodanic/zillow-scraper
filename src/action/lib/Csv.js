class Csv {

  /**
   * @param {Object} opts - CSV file options
   * {
   *  fields: ['url', 'name'],
   *  fieldDelimiter: ',',
   *  fieldWrapper: '"',
   *  rowDelimiter: '\n',
   * }
   */
  constructor(opts) {
    if (!opts.fields) { throw new Error('CSV fields are not defined.'); }

    // CSV file options
    this.fields = opts.fields; // array of CSV fields
    this.fieldDelimiter = opts.fieldDelimiter !== undefined ? opts.fieldDelimiter : ',';
    this.fieldWrapper = opts.fieldWrapper !== undefined ? opts.fieldWrapper : ''; // when field is JSON then use empty string as field delimiter
    this.rowDelimiter = opts.rowDelimiter !== undefined ? opts.rowDelimiter : '\n';

    // header
    this.header = this._fields2header();
  }



  /***************************** PRIVATE ****************************/
  /******************************************************************/

  /**
   * Convert this.fields array to string which is the first row (header) in the CSV file.
   * @returns {string}
   */
  _fields2header() {
    const fields = this.fields.map(field => this.fieldWrapper + field + this.fieldWrapper); // ['"name"', '"age"']
    const header = fields.join(this.fieldDelimiter) + this.rowDelimiter; // "name","age"\n
    return header;
  }


  /**
   * Convert array of rows to string.
   * Argument "rows" can be an array of objects: [{url: 'www.site1.com', name: 'Peter'}, ...] where url and name must be in the this.fields
   * Argument "rows" can be an array of arrays: [['www.site1.com', 'Peter'], ...] where array elements must have same order as in the this.fields
   * @param {any[]} rows - rows
   * @returns {string}
   */
  _rows2str(rows) {
    let rows_str = '';
    rows.forEach(row => {
      this.fields.forEach((field, key) => {
        const fieldValue = Array.isArray(row) ? this._get_fieldValue(row, key) : this._get_fieldValue(row, field);
        if (key + 1 < this.fields.length) { rows_str += fieldValue + this.fieldDelimiter; }
        else { rows_str += fieldValue; }
      });
      rows_str += this.rowDelimiter;
    });
    return rows_str;
  }


  /**
   * Get field value from the row object after some corrections
   * @param {object} row - CSV row in the object format: {url: 'www.site1.com', name: 'Peter'}
   * @param {string} field - field of the row object: 'url'
   * @return {string} - row field in the string format. if the value is object then it is stringified
   */
  _get_fieldValue(row, field) {
    // correct & beautify field value
    let fieldValue = row[field];

    // convert into the string because CSV fields are strings
    if (fieldValue === undefined) {
      fieldValue = '';
    } else if (typeof fieldValue === 'object') {
      fieldValue = JSON.stringify(fieldValue); // convert object into string
      fieldValue = fieldValue.replace(/\"/g, '\'');
    } else if (typeof fieldValue === 'number') {
      fieldValue = fieldValue.toString();
    } else if (typeof fieldValue === 'boolean') {
      fieldValue = fieldValue ? 'true' : 'false';
    }

    fieldValue = String(fieldValue);

    fieldValue = fieldValue.slice(0, 32767); // reduce number of characters according to https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3
    fieldValue = fieldValue.replace(/\"/g, '\"'); // escape double quotes
    fieldValue = fieldValue.replace(/ {2,}/g, ' '); // replace 2 or more empty spaces with just one space
    fieldValue = fieldValue.replace(/\n|\r/g, ''); // remove new line and carriage returns
    fieldValue = fieldValue.trim(); // trim start & end of the string
    fieldValue = this.fieldWrapper + fieldValue + this.fieldWrapper; // wrap into double quotes "..."

    return fieldValue;
  }


  /**
   * Convert string into integer, float or boolean.
   * @param {string} value
   * @returns {string | number | boolean | object}
   */
  _typeConvertor(value) {
    function isJSON(value) {
      try { JSON.parse(value); }
      catch (err) { return false; }
      return true;
    }

    if (!!value && !isNaN(value) && !/\./.test(value)) { // convert string into integer (12)
      value = parseInt(value, 10);
    } else if (!!value && !isNaN(value) && /\./.test(value)) { // convert string into float (12.35)
      value = parseFloat(value);
    } else if (value === 'true' || value === 'false') { // convert string into boolean (true)
      value = JSON.parse(value);
    } else if (isJSON(value)) {
      value = JSON.parse(value);
    }

    return value;
  }


  /**
   * Test CSV row against query. Query is simmilar to MongoDB -> $eq, $ne, $gt, ....
   * @param {object} row - CSV row in object format
   * @param {object} query - query for the row object, for example: {name: {$regex: /john/i}}
   * @returns {boolean}
   */
  _searchLogic(row, query) {
    const props = Object.keys(query);
    let tf = true;

    for (const prop of props) {
      const $eq = query[prop].$eq; // query -> {name: {$eq: 'Johnny'}}
      const $ne = query[prop].$ne; // {name: {$ne: 'Johnny'}}
      const $gt = query[prop].$gt; // {age: {$gt: 22}}
      const $gte = query[prop].$gte; // {age: {$gte: 22}}
      const $lt = query[prop].$lt; // {name: {$lt: 22}}
      const $lte = query[prop].$lte; // {name: {$lte: 22}}
      const $regex = query[prop].$regex; // {name: {$regex: /Joh/i}}
      const $in = query[prop].$in; // {name: {$in: ['John', 'Mark']}}
      const $exists = query[prop].$exists; // {user_id: {$exists: false}}

      if ($eq !== undefined) {
        tf = tf && row[prop] === query[prop].$eq;
      } else if ($ne !== undefined) {
        tf = tf && row[prop] !== query[prop].$ne;
      } else if ($gt !== undefined) {
        tf = tf && row[prop] > query[prop].$gt;
      } else if ($gte !== undefined) {
        tf = tf && row[prop] >= query[prop].$gte;
      } else if ($lt !== undefined) {
        tf = tf && row[prop] < query[prop].$lt;
      } else if ($lte !== undefined) {
        tf = tf && row[prop] <= query[prop].$lte;
      } else if ($regex !== undefined) {
        tf = tf && $regex.test(row[prop]);
      } else if ($in !== undefined) {
        tf = tf && query[prop].$in.indexOf(row[prop]) !== -1;
      } else if ($exists !== undefined) {
        const extProps = Object.keys(row);
        if ($exists === true) { tf = tf && extProps.indexOf(prop) !== -1; }
        else if ($exists === false) { tf = tf && extProps.indexOf(prop) === -1; }
      } else {
        tf = tf && row[prop] === query[prop];
      }

    }
    return tf;
  }



}




export default Csv;
