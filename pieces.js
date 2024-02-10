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

function getDiv() {
  let ele = document.createElement('DIV');
  let al = arguments.length;
  if (al > 0) {
    for (var i = 0; i < al; i++) addClass(ele, arguments[i]);
  }
  return ele;
}

function addOption(ele, value, text, selected) {
  let newOption = document.createElement('OPTION');
  newOption.setAttribute('value', value);
  newOption.innerHTML = text;
  ele.appendChild(newOption);
  if (selected) {
    newOption.selected = true;
  }
}

function addClass(ele, name) { ele.classList.add(name); return ele; }
function removeClass(ele, name) { ele.classList.remove(name); return ele; }
function toggleClass(ele, name) { ele.classList.toggle(name); return ele; }

function button(text) {
  var i;
  let al = arguments.length;
  let ele = getDiv();
  if (al > 1) for (i = 1; i < al; i++) addClass(ele, arguments[i]);
  ele.innerHTML = text;
  return ele;
}
function fromOther(other) {
  let ele = getDiv();
  ele.innerHTML = other.innerHTML;
  return ele;
}
function fromOther(other, className) {
  let ele = getDiv();
  ele.innerHTML = other.innerHTML;
  addClass(ele, className);
  return ele;
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

function processSingleSelect(ele) {
  var sSelect, sSelectLen, ss, ssa, builder1, builder2, j, k, i;
  sSelect = ele.getElementsByTagName(SEL)[0];
  sSelectLen = sSelect.length;
  ssa = sSelect.children;
  console.log(ssa);
  ss = sSelect.options[sSelect.selectedIndex];
  builder1 = fromOther(ss, S_S_SELECTED);
  ele.appendChild(builder1);
  builder2 = getDiv(S_S_ITEMS, S_HIDE);
  for (i = 0; i < sSelectLen; i++) {
    ss = sSelect.options[i];
    var builder3 = getOption(ss);
    builder3.addEventListener(CLICK, e => {
      var target, ih;
      target = getOptionTarget(e);
      ih = getOptionInnerHTML(target);

      for (j = 0; j < sSelectLen; j++) {
        if (sSelect.options[j].innerHTML == ih) {
          sSelect.selectedIndex = j;
          builder1.innerHTML = ih;
          var y = target.parentNode.getElementsByClassName(S_OPT);
          var yl = y.length;
          for (k = 0; k < yl; k++) { toggleClass(y[k], S_OPT); }
          toggleClass(target, S_OPT);
          break;
        }
      }
      builder1.click;
    });
    builder2.appendChild(builder3);
  }
  ele.appendChild(builder2);
  builder1.addEventListener(CLICK, e => {
    e.stopPropagation();
    closeAllSelect(this);
    toggleClass(e.target.nextSibling, S_HIDE);
    toggleClass(e.target.parentNode, S_ARROW);
  });
}

function processMultiSelect(ele) {
  var mSelect, mSelectLen, ms, builder1, builder2, butt;
  mSelect = ele.getElementsByTagName(SEL)[0];
  mSelect.multiple = true;
  let ph = mSelect.hasAttribute('placeholder') ? mSelect.getAttribute('placeholder') : 'Make your selections';
  addOption(mSelect, 'placeholder', 'Make your selections', true);
  mSelectLen = mSelect.length;
  mSelect.options[0].selected = false;
  ms = mSelect.options[mSelect.selectedIndex];
  builder1 = getDiv(M_S_SELECTED);
  builder1.innerHTML = ph;
  ele.appendChild(builder1);
  builder2 = getDiv(M_S_ITEMS, S_HIDE);

  for (let i = 0; i < mSelectLen - 1; i++) {
    ms = mSelect.options[i];
    var builder3 = getOption(ms);
    builder3.addEventListener(CLICK, e => {
      var target, ih, s_opts;
      target = getOptionTarget(e);
      ih = getOptionInnerHTML(target);

      for (let j = 0; j < mSelectLen - 1; j++) {
        if (mSelect.options[j].innerHTML == ih) {
          toggleClass(target, S_OPT);
          s_opts = builder1.innerHTML.split(',');
          if (target.classList.contains(S_OPT)) {
            mSelect.options[j].selected = true;
            s_opts.push(ih);
            if (s_opts[0] == ph) {
              mSelect.options[mSelectLen - 1].selected = false;
              s_opts.shift();
            }
          }
          else {
            mSelect.options[j].selected = false;
            s_opts.splice(s_opts.indexOf(ih), 1);
            if (s_opts.length == 0) {
              mSelect.options[mSelectLen - 1].selected = true;
              s_opts.push(ph);
            }
          }
          builder1.innerHTML = s_opts.join(',')
          break;
        }
      }
    });
    builder2.appendChild(builder3);
  }
  ele.appendChild(builder2);
  builder1.addEventListener(CLICK, e => {
    e.stopPropagation();
    closeAllSelect(this);
    toggleClass(e.target.nextSibling, S_HIDE);
    toggleClass(e.target.parentNode, S_ARROW);
  });
}

getAndProcessElements('single-selector', processSingleSelect);
getAndProcessElements('multi-selector', processMultiSelect);

function getOption(sourceOption) {
  let e = getDiv();
  if (sourceOption.hasAttribute('subtext')) {
    var ie = getDiv();
    ie.innerHTML = sourceOption.innerHTML;
    e.appendChild(ie);
    ie = getDiv('option-desc');
    ie.innerHTML = sourceOption.getAttribute('subtext');
    e.appendChild(ie);
    addClass(e, 'described-option');
  } else {
    e.innerHTML = sourceOption.innerHTML;
    addClass(e, OPT);
  }
  return e;
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