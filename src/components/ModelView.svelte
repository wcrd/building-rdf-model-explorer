<script>
    import AgGrid from "./AgGrid.svelte";

    import EntityData from "../data/agGrid.json"
    import EntityPointsData from "../data/agGrid_pnts.json"
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

    let api;

    let columnDefs = [
        { headerName: "Label", field: "label", colId: "labelCol", },
        {
            headerName: "Class",
            field: "class",
            sortable: true,
            editable: true,
            cellRenderer: nodeGetter,
        },
        { headerName: "Ontology", field: "class", cellRenderer: ontologyGetter },
        { headerName: "Subject", field: "subject", sortable: true },
    ];

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
        return params.value.split("#").pop()
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

    // GRID CONTROL
    function onFilterTextBoxChanged() {
        api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
        api.expandAll();
    }

    function collapseRows() {
        api.collapseAll();
    }

    function expandRows() {
        api.expandAll();
        console.log(debug)
    }



</script>

<style>
</style>


<div id="controller-bar" class="flex flex-row space-x-2 m-2">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded" on:click={expandRows}>
        Expand All
    </button>
    <button class="bg-slate-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded" on:click={collapseRows}>
        Collapse All
    </button>
    <div class="border rounded">
        <input class="w-100" type="search" id="filter-text-box" placeholder="Filter..." on:input={onFilterTextBoxChanged}>
    </div>
</div>
<AgGrid bind:api bind:data {columnDefs} {options}/>