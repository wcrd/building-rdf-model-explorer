<script>
    import AgGrid from "./AgGrid.svelte";

    import EntityData from "../data/agGrid.json"
    
    // let data = [
    //     { make: "Toyota", model: "Celica", price: 35000, path: "usa/car/ok" },
    //     { make: "Ford", model: "Mondeo", price: 32000, path: "usa/truck/ok" },
    //     { make: "Taurus", model: "X", price: 32000, path: "usa/truck/shit" },
    //     { make: "Porsche", model: "Boxter", price: 72000, path: "aus/car/ok" },
    // ];

    let data = EntityData;

    let columnDefs = [
        {
            headerName: "Class",
            field: "class",
            sortable: true,
            editable: true,
            cellRendererParams: {
                innerRenderer: nodeGetter
            }
        },
        { headerName: "Subject", field: "subject", sortable: true },
    ];

    let options = {
        treeData: true,
        getDataPath: getDataPath,
        autoGroupColumnDef: {
                headerName: "Entity",
                width: 300,
                sortable: true,
                cellRendererParams: {
                    suppressCount: false,
                    innerRenderer: labelGetter
                },
                filter: 'agTextColumnFilter',
                resizable: true
        },
        defaultColDef: {
            sortable: true,
            flex: 1,
            resizable: true
        },
    }

    function getDataPath(data) {
        const raw = data.path.split("</>"); // this should help with duplicates. Will then use a formatter function to display term only.
        
        return raw
    }

    function labelGetter(params) {
        return params.data.label
    }

    function nodeGetter(params){
        console.log(params)
        return "A"
    }
</script>

<AgGrid bind:data {columnDefs} {options}/>