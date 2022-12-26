// Copyright (c) 2022, sayan and contributors
// For license information, please see license.txt

frappe.ui.form.on('Bill', {
	setup: function(frm){
		// check item duplicate
		frm.check_item_duplicate = function(frm, content){
			frm.doc.billed_items.forEach( i => {
				// console.log(i.idx, i.item, content.idx, content.item);
				if(content.item === '' || content.idx === i.idx){
					// pass
				} else {
					if(content.item === i.item){
						content.item = null;
						frappe.throw(__("Item is already there!"));
						frm.refresh_field('billed_items');
					}
				}
			})
		}
	}

		// refresh: function(frm) {
	
		// }
});

// ChildDocType ('Bill Table'):

frappe.ui.form.on('Bill Table', {
	item: function(frm, cdt, cdn) {

		// grab the entire record
		let row = locals[cdt][cdn];
		// console.log(row);
		frm.check_item_duplicate(frm, row);
	}	
});

// below codes works on parent doctype (Bill) and fetches the 
// data from childDocType table in the Parent Doc (i.e., billed_items)


frappe.ui.form.on('Bill', {
	validate: function(frm) {
		
		let total = 0;

		// grab the entire record
		for (let row of frm.doc.billed_items){

			let item_total = row.price * row.qty;

			row.total_price = item_total;

			total = total + item_total;
			
			// frm.refresh_field("total_price");
			// console.log(row.item, row.price, row.qty, total_price);
		}
		

		// adding tax
		if (frm.doc.tax){
			total = total + (total * frm.doc.tax/100);	
		};
		// console.log(total);
		frm.set_value("grand_total", total);
		frm.refresh_field("grand_total");
		
	}
	
});

// ChildDocType ('Bill Table' not the Table 'Billed Items' ):

// frappe.ui.form.on('Bill Table', {
// 	item: function(frm, cdt, cdn) {

// 		// // grab the entire record
// 		let row = locals[cdt][cdn];
// 		// // console.log(row);
// 		frm.check(frm, row.item);

// 		// frappe.msgprint(__("Hello"))
// 	}	
// });