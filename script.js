var style = document.createElement('style');
style.setAttribute("id","multiselect_dropdown_styles");
// style.innerHTML = `

// `;
// document.head.appendChild(style);
var checked_input = [];
function MultiselectDropdown(options){
  var config={
    search:true,
    height:'15rem',
    placeholder:'select',
    txtSelected:'selected',
    txtAll:'All',
    txtRemove: 'Remove',
    txtSearch:'search',
    searchWarning:"No Item Available",
    ...options
  };
  function newEl(tag,attrs){
    var e=document.createElement(tag);
    if(attrs!==undefined) Object.keys(attrs).forEach(k=>{
      if(k==='class') { Array.isArray(attrs[k]) ? attrs[k].forEach(o=>o!==''?e.classList.add(o):0) : (attrs[k]!==''?e.classList.add(attrs[k]):0)}
      else if(k==='style'){  
        Object.keys(attrs[k]).forEach(ks=>{
          e.style[ks]=attrs[k][ks];
        });
       }
      else if(k==='text'){attrs[k]===''?e.innerHTML='&nbsp;':e.innerText=attrs[k]}
      else e[k]=attrs[k];
    });
    return e;
  }

  
  document.querySelectorAll("select[multiple]").forEach((el,k)=>{
    //change width of conifg
    // config.height = `el.getElment`
    let className =  el.getAttribute("className");
    let height = el.getAttribute("data-height");
    let width = el.getAttribute("data-width");
    let placeholder = el.getAttribute("value");
    let searchTxt = el.getAttribute("search");
    config.txtSearch = searchTxt;
    config.searchWarning = el.getAttribute("search-warning");
    config.placeholder = placeholder;
    config.width = width;
    config.height = height;
    
    var div=newEl('div',{class:`multiselect-dropdown`});
    div.classList.add(className);
    el.style.display='none';
    
    el.parentNode.insertBefore(div,el.nextSibling);
    var listWrap=newEl('div',{class:'multiselect-dropdown-list-wrapper'});
    var closeDropDown = newEl("span",{class:"close-dropdown",text:"x"});
    listWrap.appendChild(closeDropDown);
  
    var list=newEl('div',{class:'multiselect-dropdown-list',style:{height:config.height}});
    var searchContainer = newEl("div",{class:"search-container"});
    var searchlabel = newEl("label",{class:'search-label',name:"search"});
    searchlabel.innerHTML = `<i class="fas fa-search"></i>`;

    var search=newEl('input',{class:['multiselect-dropdown-search'].concat([config.searchInput?.class??'form-control']),style:{width:'100%',display:el.attributes['multiselect-search']?.value==='true'?'block':'none'},placeholder:config.txtSearch,name:"search"});
    var searchClose= newEl('label',{clase:"search-close",id:"closeSearch",text:"x"})
    searchContainer.appendChild(searchlabel);
    searchContainer.appendChild(search);
    searchContainer.appendChild(searchClose);

    listWrap.appendChild(searchContainer);
    div.appendChild(listWrap);
    listWrap.appendChild(list);
    
    el.loadOptions=()=>{
      list.innerHTML='';

      Array.from(el.options).map(o=>{
        var op=newEl('div',{class:o.selected?'checked':'',optEl:o})
        

        var ic=newEl('input',{type:'checkbox',checked:o.selected});
        op.appendChild(ic);
        op.appendChild(newEl('label',{text:o.text}));

        op.addEventListener('click',(e)=>{
            if(checked_input.length === parseInt(el.getAttribute("multiselect-max-items"))){
              let opd =  checked_input.shift();
              opd.classList.toggle('checked');
            opd.querySelector("input").checked=!opd.querySelector("input").checked;
            opd.optEl.selected=!!!opd.optEl.selected;
            el.dispatchEvent(new Event('change'));
            }
            op.classList.toggle('checked');
            op.querySelector("input").checked=!op.querySelector("input").checked;
            op.optEl.selected=!!!op.optEl.selected;
            el.dispatchEvent(new Event('change'));
            checked_input.push(op);
          
          
        });
        
        ic.addEventListener('click',(ev)=>{
          ic.checked=!ic.checked;
          
        });
        o.listitemEl=op;
        list.appendChild(op);
      });
      div.listEl=listWrap;

      div.refresh=()=>{
        div.querySelectorAll('span.optext, span.placeholder').forEach(t=>div.removeChild(t));
        var sels=Array.from(el.selectedOptions);
        if(sels.length>(el.attributes['multiselect-max-items']?.value??5)){
          
          div.appendChild(newEl('span',{class:['optext','maxselected'],text:sels.length+' '+config.txtSelected}));          
        }
        else{
          sels.map(x=>{
            div.appendChild(newEl('span',{class:'placeholder',text:el.attributes['placeholder']?.value??config.placeholder}));
            var c=newEl('span',{class:'optext',text:x.text, srcOption: x});

            div.appendChild(c);
          });
        }
        if(0==el.selectedOptions.length) div.appendChild(newEl('span',{class:'placeholder',text:el.attributes['placeholder']?.value??config.placeholder}));
      };
      div.refresh();
    }
    el.loadOptions();
    searchClose.addEventListener("click",()=>{
      search.value = "";
      if(search.value === ""){
        list.childNodes.forEach(listItem=>{
          listItem.style.display="block";
          if(listItem.getAttribute("id") === "no_search")
          {
            listItem.style.display = "none";
          }
        })
      }
    })
    search.addEventListener('input',()=>{
      let label=list.querySelector("#no_search");
      let newValue = newEl('label',{text:config.searchWarning,id:"no_search"});
       if (label === null)
       {
                
                newValue.style.display = 'none';
                list.appendChild(newValue);

       }
      list.querySelectorAll(":scope div:not(.multiselect-dropdown-all-selector)").forEach(d=>{
        var txt=d.querySelector("label").innerText.toUpperCase();
        d.style.display=txt.includes(search.value.toUpperCase())?'block':'none';
      });
      let countNone = 0
      
      list.childNodes.forEach(child=>{
        
        if(child.style.display === "none" && child.getAttribute("id") !=="no_search"){
          countNone += 1;
        }
        if(countNone === list.childNodes.length-1)
          {
             label.style.display ="block"
             
          }
          if(label!== null && countNone<list.childNodes.length-1){
             label.style.display = 'none';
          }
      })
    });
    div.addEventListener('click', function(event) {
        div.listEl.style.display='block';
        search.focus();
        search.select();
        if(event.target.getAttribute("class") === "close-dropdown"){
          listWrap.style.display = "none";
          div.refresh();
        }
        
        let target = event.target.parentElement.getAttribute("class") === "checked"? event.target.parentElement:event.target;
        if(target.getAttribute("class") === "checked"){
          listWrap.style.display = "none";
          div.refresh();
        }

        
        
    });    
  });
}

window.addEventListener('load',()=>{
  MultiselectDropdown(window.MultiselectDropdownOptions);
});