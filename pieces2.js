let CLICK = 'click';
let OPT = 'option';
let S_S_SELECTED = 'single-select-selected';
let M_S_SELECTED = 'multi-select-selected';
let S_S_ITEMS = 'single-select-items';
let M_S_ITEMS = 'multi-select-items';
let S_HIDE = 'select-hide';
let S_OPT = 'selected-option';
let S_ARROW = 'select-arrow-active';
let SEL = 'select';
let PH = 'placeholder';

function getDiv() {
  let ele = document.createElement('DIV');
  let al = arguments.length;
  if (al > 0) for (let i = 0; i < al; i++) addClass(ele, arguments[i]);
  return ele;
}

function getHeader(level, text) {
  let ele = document.createElement('H' + level);
  ele.innerHTML = text;
  let al = arguments.length;
  if (al > 2) for (let i = 2; i < al; i++) addClass(ele, arguments[i]);
  return ele;
}

function addOption(ele, value, text, selected) {
  let newOption = document.createElement('OPTION');
  newOption.setAttribute('value', value);
  newOption.innerHTML = text;
  ele.appendChild(newOption);
  if (selected) newOption.selected = true;
}

function addClass(ele, name) { ele.classList.add(name); return ele; }
function removeClass(ele, name) { ele.classList.remove(name); return ele; }
function toggleClass(ele, name) { ele.classList.toggle(name); return ele; }

function button(text) {
  let al = arguments.length;
  let ele = getDiv();
  if (al > 1) for (let i = 1; i < al; i++) addClass(ele, arguments[i]);
  ele.innerHTML = text;
  return ele;
}
function fromOther(other) {
  // Create an empty div and then set its innerHTML to that of other.
  let ele = getDiv();
  ele.innerHTML = other.innerHTML;
  return ele;
}
function fromOther(other, className) {
  // Create the empty div and then set its innerHTML to that of other.
  let ele = getDiv(className);
  ele.innerHTML = other.innerHTML;
  return ele;
}

function putIntoDiv(ele) {
  // Create the div to put the element into.
  let builder = getDiv();
  // Make sure the div has any extra arguments used as class names.
  // This is primarily to simplify subsequent calls.
  let al = arguments.length;
  if (al > 1) for (let i = 1; i < al; i++) addClass(builder, arguments[i]);
  // Put the div into the document right before where the element was.
  ele.parentNode.insertBefore(builder, ele);
  // Put the element into the div.
  builder.appendChild(ele);
  // Return the div that was created.
  return builder;
}

function getAndProcessElements(className, processor) {
  var elements, eLen, i, ele;
  elements = document.getElementsByClassName(className);
  eLen = elements.length;
  for (i = 0; i < eLen; i++) {
    ele = elements[i];
    processor(ele);
  }
}

function getAndProcessElementsByTagName(tagName, processor) {
  var elements = document.getElementsByTagName(tagName);
  for (let i = 0; i < elements.length; i++) processor(elements[i]);
}

function processSingleSelect(ele) {
  var sSelect, sSelectLen, ss, builder1, builder2, si, builder3;
  builder1 = putIntoDiv(ele, 'form-group');
  console.log(builder1);
  builder2 = getDiv('single-selector');
  builder1.appendChild(builder2);
  si = processOptions(S_S_ITEMS, ele, 1);
  builder2.appendChild(si);
  let ph = getPlaceholder(ele);
  ss = getSelectionRep(si, S_S_SELECTED, ph, true);
  builder2.insertBefore(ss, si);
  ss.addEventListener(CLICK, e => {
    e.stopPropagation();
    closeAllSelect(this);
    toggleClass(si, S_HIDE);
    toggleClass(ss, S_ARROW);
  });
  sSelect = getSelect(ele, si, ph, false);
  sSelectLen = sSelect.length;
  builder2.insertBefore(sSelect, ss);
  if (ele.hasAttribute('id') && ele.hasAttribute('label')) {
    builder3 = document.createElement('LABEL');
    builder3.setAttribute('for', ele.getAttribute('id'));
    builder3.innerHTML = ele.getAttribute('label');
    builder1.insertBefore(builder3, builder2);
  }
  Array.from(si.children).forEach(opt => {
    opt.addEventListener(CLICK, e => {
      var target, v;
      target = getOptionTarget(e);
      v = target.getAttribute('value');
      for (let i = 0; i < sSelectLen; i++) {
        if (sSelect.options[i].getAttribute('value') === v) {
          doOnOptions(si, opt => removeClass(opt, S_OPT));
          sSelect.options[i].selected = true;
          addClass(target, S_OPT);
          ss.innerHTML = getOptionInnerHTML(target);
          break;
        }
      }
    });
  });
}

function processMultiSelect(ele) {
  var mSelect, mSelectLen, ms, builder1, builder2, mi, builder3;
  builder1 = putIntoDiv(ele, 'form-group');
  console.log(builder1);
  builder2 = getDiv('multi-selector');
  builder1.appendChild(builder2);
  mi = processOptions(M_S_ITEMS, ele, 0);
  builder2.appendChild(mi);
  let ph = getPlaceholder(ele);
  ms = getSelectionRep(mi, M_S_SELECTED, ph, false);
  builder2.insertBefore(ms, mi);
  ms.addEventListener(CLICK, e => {
    e.stopPropagation();
    closeAllSelect(this);
    toggleClass(mi, S_HIDE);
    toggleClass(ms, S_ARROW);
  });
  mSelect = getSelect(ele, mi, ph, true);
  mSelectLen = mSelect.length;
  builder2.insertBefore(mSelect, ms);
  if (ele.hasAttribute('id') && ele.hasAttribute('label')) {
    builder3 = document.createElement('LABEL');
    builder3.setAttribute('for', ele.getAttribute('id'));
    builder3.innerHTML = ele.getAttribute('label');
    builder1.insertBefore(builder3, builder2);
  }
  Array.from(mi.children).forEach(opt => {
    opt.addEventListener(CLICK, e => {
      var target, v;
      target = getOptionTarget(e);
      v = target.getAttribute('value');
      for (let i = 0; i < mSelectLen; i++) {
        if (mSelect.options[i].getAttribute('value') === v) {
          toggleClass(target, S_OPT);
          let s_opts = ms.innerHTML.split(',');
          if (target.classList.contains(S_OPT)) {
            mSelect.options[i].selected = true;
            s_opts.push(getOptionInnerHTML(target));
            if (s_opts[0] === ph) {
              s_opts.shift();
              mSelect.options[mSelectLen - 1].selected = false;
            }
          } else {
            mSelect.options[i].selected = false;
            s_opts.splice(s_opts.indexOf(getOptionInnerHTML(target)), 1);
            if (s_opts.length === 0) {
              s_opts.push(ph);
              mSelect.options[mSelectLen - 1].selected = true;
            }
          }
          ms.innerHTML = s_opts.join(',');
          break;
        }
      }
    });
  });
}

getAndProcessElementsByTagName('single-select', processSingleSelect);
getAndProcessElementsByTagName('multi-select', processMultiSelect);

function doOnOptions(options, todo) {
  var l1, l2;
  l1 = options.children.length;
  for (let i = 0; i < l1; i++) {
    if (options.children[i].classList.contains('option-group')) {
      let opts = options.children[i].getElementsByClassName('options')[0].children;
      l2 = opts.length;
      for (let j = 0; j < l2; j++) todo(opts[j]);
    } else todo(options.children[i]);
  }
}

function getSelectionRep(source, className, placeholder, limit) {
  // limit should be a boolean, representing whether there should only be one value selected or not.
  let ele = getDiv(className);
  let text = getSelectedText(source);
  if (text.length === 0) ele.innerHTML = placeholder;
  else if (limit) ele.innerHTML = text[0];
  else ele.innerHTML = text.join(',');
  return ele;
}

function getSelect(source, options, placeholder, multi) {
  let ele = document.createElement('SELECT');
  if (multi) ele.multiple = true;
  Array.from(options.children).forEach(option => {
    cloneOptionForSelect(option).forEach(newOption => { ele.appendChild(newOption); });
  });
  addClass(ele, 'form-control');
  if (source.hasAttribute('id')) ele.setAttribute('id', source.getAttribute('id'));
  ele.setAttribute('name', source.getAttribute('name'));
  if (getSelectedValues(options).length === 0) addOption(ele, PH, placeholder, true);
  else addOption(ele, PH, placeholder, false);
  return ele;
}
function cloneOptionForSelect(option) {
  let builder = [];
  if (option.classList.contains('option-group')) {
    Array.from(option.getElementsByClassName('options')[0].children).forEach(e => {
      builder.push(cloneOptionForSelect(e)[0]);
    });
  } else if (option.classList.contains('described-option')) {
    var ele = document.createElement('OPTION');
    ele.setAttribute('value', option.getAttribute('value'));
    ele.innerHTML = option.children[0].innerHTML;
    if (option.classList.contains(S_OPT)) ele.selected = true;
    builder.push(ele);
  } else {
    var ele = document.createElement('OPTION');
    ele.setAttribute('value', option.getAttribute('value'));
    ele.innerHTML = option.innerHTML;
    if (option.classList.contains(S_OPT)) ele.selected = true;
    builder.push(ele);
  }
  return builder;
}

function getPlaceholder(source) {
  return source.hasAttribute(PH) ? source.getAttribute(PH) : 'Make your selection';
}
function getSelectedValues(source) {
  let opts = source.children;
  let optLen = opts.length;
  let values = [];
  for (let i = 0; i < optLen; i++) {
    if (opts[i].classList.contains('option-group')) {
      getSelectedValues(opts[i].getElementsByClassName('options')[0]).forEach(e => {
        values.push(e);
      });
    } else if (opts[i].classList.contains(S_OPT)) values.push(opts[i].getAttribute('value'));
  }
  return values;
}
function getSelectedText(source) {
  let opts = source.children;
  let optLen = opts.length;
  let values = [];
  for (let i = 0; i < optLen; i++) {
    if (opts[i].classList.contains('option-group')) {
      getSelectedText(opts[i].getElementsByClassName('options')[0]).forEach(e => {
        values.push(e);
      });
    } else if (opts[i].classList.contains(S_OPT)) {
      if (opts[i].classList.contains('described-option')) {
        values.push(opts[i].children[0].innerHTML);
      } else values.push(opts[i].innerHTML);
    }
  }
  return values;
}

function processOptions(className, optionSource, limit) {
  // limit should be either 1 or 0.
  // If it is 1, that means selected options should be limited to 1.
  // If it is 0, that means selected options may be limitless.
  // Internal functions will change limit to -1
  // All the horrible logic is written here since an integer can't be passed by
  // reference. It might be possible to re-write it to use a one-index array or
  // an object, but I didn't bother to do that originally.
  let _ele = getDiv(className, S_HIDE);
  Array.from(optionSource.children).forEach(source => {
    var ele;
    if (source.tagName === 'OPTION') {
      ele = getOption(source, limit);
      if (ele.classList.contains(S_OPT) && (limit === 1)) limit = -1;
    } else {
      ele = getDiv('option-group');
      var ie = getHeader(4, source.getAttribute('label'));
      ele.appendChild(ie);
      ie = getDiv('options');
      Array.from(source.children).forEach(e => {
        var o = getOption(e, limit);
        ie.appendChild(o);
        if (o.classList.contains(S_OPT) && (limit === 1)) limit = -1;
      });
      ele.appendChild(ie);
      if (source.hasAttribute('selected') && limit > 0) {
        if (limit === 1) {
          limit = -1;
          addClass(ie.children[0], S_OPT);
        } else Array.from(ie.children).forEach(e => { addClass(e, S_OPT); });
      }
      if (source.hasAttribute('value')) {
        let v = source.getAttribute('value') + '-';
        Array.from(ie.children).forEach(e => {
          e.setAttribute('value', v + e.getAttribute('value'));
        });
      }
    }
    _ele.append(ele);
  });
  return _ele;
}

function getOption(sourceOption, limit) {
  let ele = getDiv();
  if (sourceOption.hasAttribute('subtext')) {
    var ie = getDiv();
    ie.innerHTML = sourceOption.innerHTML;
    ele.appendChild(ie);
    ie = getDiv('option-desc');
    ie.innerHTML = sourceOption.getAttribute('subtext');
    ele.appendChild(ie);
    addClass(ele, 'described-option');
  } else {
    ele.innerHTML = sourceOption.innerHTML;
    addClass(ele, OPT);
  }
  if (sourceOption.hasAttribute('selected') && limit > -1) {
    addClass(ele, S_OPT);
  }
  ele.setAttribute('value', sourceOption.getAttribute('value'));
  return ele;
}

function getOptionTarget(event) {
  return !event.target.classList.contains(OPT) ? event.target.parentNode : event.target;
}
function getOptionInnerHTML(option) {
  return option.classList.contains(OPT) ? option.innerHTML : option.children[0].innerHTML;
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, xm, y, ym, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName(S_S_ITEMS);
  y = document.getElementsByClassName(S_S_SELECTED);

  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) arrNo.push(i);
    else removeClass(y[i], S_ARROW);
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) addClass(x[i], S_HIDE);
  }
}

document.addEventListener(CLICK, closeAllSelect);