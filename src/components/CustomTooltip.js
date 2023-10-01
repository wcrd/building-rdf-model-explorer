class CustomTooltip {
    init(params) {
      const eGui = (this.eGui = document.createElement('div'));
      const color = params.color || 'white';
      const data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
  
      eGui.classList.add('custom-tooltip');
      //@ts-ignore
      eGui.style['background-color'] = color;
      eGui.innerHTML = `
              <p>
                  <span class"name">${data}</span>
              </p>
          `;
    }
  
    getGui() {
      return this.eGui;
    }
  }

  export default CustomTooltip