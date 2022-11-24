<script>
    
    import AgGrid from "./AgGrid.svelte";

    import EntityData from "../data/agGrid.json"
    import EntityPointsData from "../data/agGrid_pnts.json"
    import OntologyData from "../data/ontology.json"
	import { onMount } from "svelte";
    
    // let data = [
    //     { make: "Toyota", model: "Celica", price: 35000, path: "usa/car/ok" },
    //     { make: "Ford", model: "Mondeo", price: 32000, path: "usa/truck/ok" },
    //     { make: "Taurus", model: "X", price: 32000, path: "usa/truck/shit" },
    //     { make: "Porsche", model: "Boxter", price: 72000, path: "aus/car/ok" },
    // ];

    const PREFIXES = {
        "https://brickschema.org/schema/Brick": "brick",
        "https://switchautomation.com/schemas/BrickExtension": "switch"
    }

    // let data = EntityData;
    let data = EntityPointsData;
    let ontologyData = OntologyData;

    // processed data
    // class set in building
    let class_set = new Set(data.map(row => row.class))

    // Get full paths for all classes, expand into set of classes we need to display
    // We are doing this because it means the full data object is put into the row, not just a 'filler' item for classes on the path
    // https://www.ag-grid.com/javascript-data-grid/tree-data/#filler-groups
    let class_all_paths_set = new Set( ontologyData.filter(row => class_set.has(row.uri)).map(row => row.path.full).flat() )


    let api;
    let treeApi;

    let columnDefs = [
        { headerName: "Label", field: "label", colId: "labelCol", filter: 'agTextColumnFilter'},
        {
            headerName: "Class",
            field: "class",
            sortable: true,
            editable: true,
            cellRenderer: nodeGetter,
            filter:'agMultiColumnFilter',
            filterParams: {
                buttons: ['clear']
            },
            filterValueGetter: classFilterValueGetter 
            
        },
        { headerName: "Ontology", field: "class", cellRenderer: ontologyGetter },
        { headerName: "Subject", field: "subject", sortable: true },
    ];

    let ontologyColumnDefs = [
        // { headerName: "Term", field: "term", sortable: true }
    ]

    let options = {
        treeData: true,
        getDataPath: getDataPath,
        autoGroupColumnDef: {
                headerName: "Entity",
                width: 300,
                sortable: true,
                // comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
                //     if (nodeA.groupData == nodeB.groupData) return 0;
                //     return (nodeA.groupData > nodeB.groupData) ? 1 : -1;
                // },
                cellRendererParams: {
                    suppressCount: true,
                    innerRenderer: labelGetter
                },
                filter: 'agTextColumnFilter',
                resizable: true
        },
        defaultColDef: {
            sortable: true,
            flex: 1,
            resizable: true,
            floatingFilter: true
        },
        sideBar: 'filters'
    }

    let ontologyGridOptions = {
        treeData: true,
        getDataPath: (data) => {
            if (data.path.full[0] == "https://brickschema.org/schema/Brick#Class"){
                if (class_all_paths_set.has(data.uri)){
                    return data.path.full.slice(1)
                } else {
                    return null
                }
            }
            else {
                return null
            }
        },
        autoGroupColumnDef: {
            headerName: "Class",
            // width: 100,
            sortable: true,
            // comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
            //     if (nodeA.groupData == nodeB.groupData) return 0;
            //     return (nodeA.groupData > nodeB.groupData) ? 1 : -1;
            // },
            cellRendererParams: {
                suppressCount: true,
                innerRenderer: classValueGetter
            },
            filter: 'agTextColumnFilter',
            resizable: true,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true
        },
        defaultColDef: {
            sortable: true,
            flex: 1,
            resizable: true
        },
        rowSelection:'multiple',
        groupSelectsChildren: true,
        onSelectionChanged: rowChangeTest
    }

    function rowChangeTest(event) {
        console.log("Event: ", event)
    }

    function getDataPath(data) {
        const raw = data.path.split("</>"); // this should help with duplicates. Will then use a formatter function to display term only.

        return raw
    }

    function labelGetter(params) {
        return params.data.label
    }

    function nodeGetter(params){
        return params.value.split("#").pop()
    }

    function classFilterValueGetter(params){
        return params.data.class.split("#").pop()
    }

    function ontologyGetter(params){
        try {
            const ont = params.value.split("#")[0]
            const prefix = PREFIXES[ont]
            return prefix ? prefix : ont
        } catch {
            return params.value
        }

    }

    function classValueGetter(params) {
        // SET ICON
        let icon = "❔" //🧱 🟢 ❔
        try {
            if(params.data.prefix == "brick") {
                icon = "🧱"
            } else if (params.data.prefix == "switch") {
                icon = "🟢"
            } else if (params.data.prefix == "owl") {
                icon = "🦉"
            }
        } catch(e) {
            console.log(`Grid::Class: No icon for given namespace of: ${params.value}`)
        }
        // SET NAME (TERM)
        try {
            return `${params.data.term} &nbsp; ${icon}`
        } catch {
            console.log(`Grid::Class: No term available for: ${params.value}`)
            return `${params.value} &nbsp; ${icon}`
        }
    }

    // GRID CONTROL
    function onFilterTextBoxChanged() {
        api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
        api.expandAll();
    }

    function onTreeFilterTextBoxChanged() {
        treeApi.setQuickFilter(
            document.getElementById('tree-filter-text-box').value
        );
        treeApi.expandAll();
    }

    // function collapseRows() {
    //     api.collapseAll();
    // }

    // function expandRows() {
    //     api.expandAll();
    //     console.log(debug)
    // }

    function collapseRows(grid_api) {
        grid_api.collapseAll();
    }

    function expandRows(grid_api) {
        grid_api.expandAll();
        console.log(debug)
    }



</script>

<style>
</style>

<div class="h-full w-full flex flex-row overflow-y-hidden">
    <div id="ontology-browser" class="w-1/5 h-full">
        <div id="controller-bar" class="flex flex-row space-x-2 my-2 px-2 w-full">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded" on:click={expandRows(treeApi)}>
                <pre> + </pre>
            </button>
            <button class="bg-slate-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded" on:click={collapseRows(treeApi)}>
                <pre> - </pre>
            </button>
            <div class="border rounded border-blue-500 flex-grow">
                <input class="w-full" type="search" id="tree-filter-text-box" placeholder="Filter..." on:input={onTreeFilterTextBoxChanged}>
            </div>
        </div>
        <AgGrid bind:api={treeApi} bind:data={ontologyData} columnDefs={ontologyColumnDefs} options={ontologyGridOptions} />
    </div>

    <div id="building-browser" class="w-4/5 h-full">
        <div id="controller-bar" class="flex flex-row space-x-2 w-full my-2">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded" on:click={expandRows(api)}>
                Expand All
            </button>
            <button class="bg-slate-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded" on:click={collapseRows(api)}>
                Collapse All
            </button>
            <div class="border rounded w-1/3 border-blue-500">
                <input class="w-full" type="search" id="filter-text-box" placeholder="Filter..." on:input={onFilterTextBoxChanged}>
            </div>
        </div>
        <AgGrid bind:api={api} bind:data columnDefs={columnDefs} options={options}/>
    </div>

</div>