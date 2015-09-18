
function formatdate($sourcedate) { // WORKS ONLINE AND OFFLINE
  var $localdaynumber = $sourcedate.getDay();
  switch ($localdaynumber) {
    case 0:
      $localday = "Sunday";
      break;
    case 1:
      $localday = "Monday";
      break;
    case 2:
      $localday = "Tuesday";
      break;
    case 3:
      $localday = "Wednesday";
      break;
    case 4:
      $localday = "Thursday";
      break;
    case 5:
      $localday = "Friday";
      break;
    case 6:
      $localday = "Saturday";
      break;
    }
  var $localdate = $sourcedate.getDate();
  if($localdate<10) $localdate = '0' + $localdate;
  var $localmonth = $sourcedate.getMonth() + 1;
  if($localmonth<10) $localmonth = '0' + $localmonth;
  var $localyear = $sourcedate.getFullYear();
  $localdatestring = $localdate+'/'+$localmonth+'/'+$localyear+' ('+$localday+')';
  return $localdatestring;
  } // end of formatdate

function pageinitialisation() { // WORKS ONLINE AND OFFLINE
  $rootpath = localStorage.getItem("rootpath");
  $pagetitle = localStorage.getItem("storedpagetitle");
  document.title = $pagetitle; 
  // if online re-download title incase of changes
  onlinecheck(function(result) {
    if(result==true) {  // online code here            
      $.post($rootpath + "getsiteparameters.php",
        function(data,status) {
	      $pagetitle = data;
          localStorage.setItem("storedpagetitle",$pagetitle);
          document.title = $pagetitle;  
	      } // end of function
	    ); // end of $post		
	  } // end of online code
	else {  // offline code here
  	  // DO NOTHING   
	  } // end of offline code
	}); // end of onlinecheck 
  } // end of pageinitialisation
  
function getbookingid() { // WORKS ONLINE AND OFFLINE (OFFLINE FUNCTION)
  var $query = window.location.search;
  // Skip the leading ?, which should always be there, 
  // but be careful anyway
  if ($query.substring(0, 1) == '?') { 
    $query = $query.substring(1);
	}
  $keyvalue = $query.split('=');
  var $bookingid = $keyvalue[1];  
  return $bookingid;
  }
  
/*function uploadcompletebookings() {  // replaced by uploadbookingdata - remove if tests successful
  
  // if online!!!
  
  var $uc_jsonbookingdata = localStorage.getItem("jsonbookingdata");
  if($uc_jsonbookingdata) var $uc_bookingdata = JSON.parse($uc_jsonbookingdata);
  var $uc_booking = {};
  for (var $uc_bookingid in $uc_bookingdata) {
    // some browsers add more properties to every object, we don't want those
    if ($uc_bookingdata.hasOwnProperty($uc_bookingid)) {
	  $uc_complete = $uc_bookingdata[$uc_bookingid].complete;

	  if($uc_complete=='yes') {  // only if complete?
	    // upload
		$uc_booking = {};
		$uc_booking = $uc_bookingdata[$uc_bookingid];
		$uc_booking.bookingid = $uc_bookingid;
		$uc_jsonbooking = JSON.stringify($uc_booking);
		$.post("../mobile/uploadbookingdata.php",{jsonbooking:$uc_jsonbooking});
		
		// check if successful
		
		delete $uc_bookingdata[$uc_bookingid];  // if upload successful
        $uc_newjsonbookingdata = JSON.stringify($uc_bookingdata);
        localStorage.setItem("jsonbookingdata",$uc_newjsonbookingdata);
		// remove from jobbarray (booked jobs)
		}
	  }
	} 
  }*/
  
/*function uploadlocalbookingdata() { // replaced by upload booking data
  
  // if online!!!
  
  var $uc_jsonbookingdata = localStorage.getItem("jsonbookingdata");
  if($uc_jsonbookingdata) {
	var $uc_bookingdata = JSON.parse($uc_jsonbookingdata);
    var $uc_booking = {};
    for (var $uc_bookingid in $uc_bookingdata) {
      // some browsers add more properties to every object, we don't want those
      if ($uc_bookingdata.hasOwnProperty($uc_bookingid)) {

  	    // upload
	    $uc_booking = {};
	    $uc_booking = $uc_bookingdata[$uc_bookingid];
	    $uc_booking.bookingid = $uc_bookingid;
	    $uc_jsonbooking = JSON.stringify($uc_booking);
		
		if (~localStorage.getItem("storedpagetitle").indexOf('DEVELOPMENT')) {
  		  alert("Uploading bookingid: " + $uc_bookingid + " - " + $uc_jsonbooking);
		  }
		
	    $.post("../mobile/uploadbookingdata.php",{jsonbooking:$uc_jsonbooking});
		
		$uc_complete = $uc_bookingdata[$uc_bookingid].complete;
		
		
		if (~localStorage.getItem("storedpagetitle").indexOf('DEVELOPMENT')) {
  		  alert("uc_complete = " + $uc_complete);
		  }
		
		
	    if($uc_complete=='yes') {  // only if complete
		if (~localStorage.getItem("storedpagetitle").indexOf('DEVELOPMENT')) {
  		  alert("getbookingdata: "+$uc_bookingid);
		  }
		
     // check if successful

   	      $.post("../mobile/getbookingdata.php",{bookingid:$uc_bookingid},function(data,status) {
          
		  if (~localStorage.getItem("storedpagetitle").indexOf('DEVELOPMENT')) {
  		    alert(data);
			}
		  
	      $jsonbookingconfirmationdownload = data;
		  
		  if (~localStorage.getItem("storedpagetitle").indexOf('DEVELOPMENT')) {
  		    alert($uc_jsonbooking + " -::::- " + $jsonbookingconfirmationdownload);
			}
		  
		  if($jsonbookingconfirmationdownload==$uc_jsonbooking) {
		 //alert("successful upload");
		  
		    // remove booking data
	        delete $uc_bookingdata[$uc_bookingid];  // only if upload successful
            $uc_newjsonbookingdata = JSON.stringify($uc_bookingdata);
            localStorage.setItem("jsonbookingdata",$uc_newjsonbookingdata);
		    // remove from jobbarray (booked jobs)
		    var $uc_jsonjobarray = localStorage.getItem("jsonjobarray");
            if($uc_jsonjobarray) 
		      {
			  var $uc_jobarray = JSON.parse($uc_jsonjobarray);
	          delete $uc_jobarray[$uc_bookingid];  // only if upload successful
              $uc_newjsonjobarray = JSON.stringify($uc_jobarray);
              localStorage.setItem("jsonjobarray",$uc_newjsonjobarray);
	          } // end of if there is a locally stored jobarray
			
			} // end of if successful
			
			});
		  
			
	      } // end of if complete 
	   
	    }
	  } 
    }
  }*/
  
/*function olduploadbookingdata() { // ONLY WORKS ONLINE BUT CAN BE CALLED ONLINE OR OFFLINE  *** REPLACED
  onlinecheck(function(result) {
    if(result==true) { // online code here	  
      var $jsonbookingdata = localStorage.getItem("jsonbookingdata");
      if($jsonbookingdata) { // only if jsonbookingdata exists
	    var $bookingdata = JSON.parse($jsonbookingdata);
        for (var $bookingid in $bookingdata) {
          // some browsers add more properties to every object, we don't want those
          if ($bookingdata.hasOwnProperty($bookingid)) {
	        var $booking = {};
	        $booking = $bookingdata[$bookingid];
	        $booking.bookingid = $bookingid;
	        $jsonbooking = JSON.stringify($booking);
		    $.post("../mobile/uploadbookingdata.php",{jsonbooking:$jsonbooking});
	        } // end of if hasownproperty
	      } // end of for loop 		
		} // end of if jsonbookingdata exists
	  } // end of online code
	  // no offline code for this one
	}); // end of onlinecheck
  } // end of uploadbookingdata*/
  
function uploadbookingdata(callback) { // ONLY WORKS ONLINE BUT CAN BE CALLED ONLINE OR OFFLINE
  $rootpath = localStorage.getItem("rootpath");
  onlinecheck(function(result) {
    if(result==true) { // online code here	  
      var $jsonbookingdata = localStorage.getItem("jsonbookingdata");
      if($jsonbookingdata) { // only if jsonbookingdata exists
	    $.post($rootpath + "uploadbookingdata.php",{jsonbookingdata:$jsonbookingdata});	
		} // end of if jsonbookingdata exists
	  } // end of online code
	  // no offline code for this one
	}); // end of onlinecheck
  callback();
  } // end of uploadbookingdata
  
function uploadriskassessmentdata(callback) { // ONLY WORKS ONLINE BUT CAN BE CALLED ONLINE OR OFFLINE
  $rootpath = localStorage.getItem("rootpath");
  onlinecheck(function(result) {
    if(result==true) { // online code here	  
      var $jsonriskassessmentdata = localStorage.getItem("jsonriskassessmentdata");
      if($jsonriskassessmentdata) { // only if jsonriskassessmentdata exists
	    $.post($rootpath + "ajax/uploadriskassessmentdata.php",{jsonriskassessmentdata:$jsonriskassessmentdata});	
		} // end of if jsonriskassessmentdata exists
	  } // end of online code
	  // no offline code for this one
	}); // end of onlinecheck
  callback();
  } // end of uploadriskassessmentdata
  
function downloadjobcompletionlist() { // ONLY WORKS ONLINE BUT CAN BE CALLED ONLINE OR OFFLINE
  $rootpath = localStorage.getItem("rootpath");
  onlinecheck(function(result) {
    if(result==true) { // online code here	  
      $.post($rootpath + "getjobcompletionlist.php",   // read the job completion list for the menu from the server
      function(data,status) {
        var $jsonjobcompletionlist = data;
        if($jsonjobcompletionlist!='') {
          localStorage.removeItem("jsonjobcompletionlist");
          localStorage.setItem("jsonjobcompletionlist",$jsonjobcompletionlist);
          } // end of if jsonjobcompletionlist exists
        }); // end of $post		
	  } // end of online code
	  // no offline code for this one
	}); // end of onlinecheck
  }
  
function downloadautocompletetypes() { // ONLY WORKS ONLINE BUT CAN BE CALLED ONLINE OR OFFLINE
  $rootpath = localStorage.getItem("rootpath");
  onlinecheck(function(result) {
    if(result==true) { // online code here	  
      $.post($rootpath + "getautocompletetypes.php",   // read the job types that should auto complete
      function(data,status) {
        var $jsonautocompletetypes = data;
        if($jsonautocompletetypes!='') {
          localStorage.removeItem("jsonautocompletetypes");
          localStorage.setItem("jsonautocompletetypes",$jsonautocompletetypes);
          } // end of if jsonautocompletetypes exists
        }); // end of $post		
	  } // end of online code
	  // no offline code for this one
	}); // end of onlinecheck
  } // end of downloadautocompletetypes
  
function downloadjobs($engineerid,callback) { // ONLY WORKS ONLINE BUT CAN BE CALLED ONLINE OR OFFLINE
  $rootpath = localStorage.getItem("rootpath");
  onlinecheck(function(result) { 
    if(result==true) { // online code here	    //  *****   CHECK $.AJAX TO HANDLE TIMEOUT     ********
	  $.mobile.loading('show');
  
      $.post($rootpath + "getbookedjobs.php",{engineerid:$engineerid},function(data,status) {
        var $jsonjobanddataarray = data;
	    //alert($jsonjobanddataarray);
		document.getElementById("tablebody").innerHTML = $jsonjobanddataarray; // display data
        var $jobanddataarray = {};
        if($jsonjobanddataarray) $jobanddataarray = JSON.parse($jsonjobanddataarray);
		//alert('Parsed');
		var $storedjsonbookingdata = localStorage.getItem("jsonbookingdata");
        var $storedbookingdata = {};
		if($storedjsonbookingdata) { // only if storedjsonbookingdata exists	
          $storedbookingdata = JSON.parse($storedjsonbookingdata);
          } // end of if exists		  
		
		var $storedjsonriskassessmentdata = localStorage.getItem("jsonriskassessmentdata");
        var $storedriskassessmentdata = {};
		if($storedjsonriskassessmentdata) { // only if storedjsonriskassessmentdata exists	
          $storedriskassessmentdata = JSON.parse($storedjsonriskassessmentdata);
          } // end of if exists		  
		
        var $jobarray = [];
		var $bookingdata = {};
		var $riskassessmentdata = {};
        for (var $item in $jobanddataarray) {
          // some browsers add more properties to every object, we don't want those
          if ($jobanddataarray.hasOwnProperty($item)) {
            var $bookingid = $item;
			//alert($bookingid);
            var $jobdetail = {};
			var $booking = {};
			var $riskassessment = {};
			$jobdetail.bookingid = $bookingid;
            $jobdetail.customer = $jobanddataarray[$bookingid].customer;
		    $jobdetail.requester = $jobanddataarray[$bookingid].requester;
		    $jobdetail.entrydate = $jobanddataarray[$bookingid].entrydate;
		    $jobdetail.date = $jobanddataarray[$bookingid].date;
		    $jobdetail.detail = $jobanddataarray[$bookingid].detail;
		    $jobdetail.timeslot = $jobanddataarray[$bookingid].timeslot;
		    $jobdetail.type = $jobanddataarray[$bookingid].type;
		    $jobdetail.length = $jobanddataarray[$bookingid].length;
		    $jobdetail.location = $jobanddataarray[$bookingid].location;
		    $jobdetail.town = $jobanddataarray[$bookingid].town;
		    $jobdetail.postcode = $jobanddataarray[$bookingid].postcode;
		    $jobdetail.projectnumber = $jobanddataarray[$bookingid].projectnumber;
		    $jobdetail.description = $jobanddataarray[$bookingid].description;
		    $jobdetail.otapprovalstatus = $jobanddataarray[$bookingid].otapprovalstatus;
		    $jobdetail.plannedstart = $jobanddataarray[$bookingid].plannedstart;
		    //$jobarray[$bookingid] = $jobdetail;			
			$jobarray.push($jobdetail);

			$downloadeddata = false;
			$booking.departtime = $jobanddataarray[$bookingid].departtime;
			$booking.starttime = $jobanddataarray[$bookingid].starttime;
			$booking.finishtime = $jobanddataarray[$bookingid].finishtime;
			$booking.returntime = $jobanddataarray[$bookingid].returntime;
			$booking.completiondetailid = $jobanddataarray[$bookingid].completiondetailid;
			$booking.complete = $jobanddataarray[$bookingid].complete;
			$booking.edited = $jobanddataarray[$bookingid].edited;	
			$booking.notes = $jobanddataarray[$bookingid].notes;	
			$booking.issues = $jobanddataarray[$bookingid].issues;	
			if($booking.departtime!='') $downloadeddata=true;
			if($booking.starttime!='') $downloadeddata=true;
			if($booking.finishtime!='') $downloadeddata=true;
			if($booking.returntime!='') $downloadeddata=true;
			if($booking.completiondetailid!='') $downloadeddata=true;
			if($booking.complete!='') $downloadeddata=true;
			if($booking.edited!='') $downloadeddata=true;
			if($booking.notes!='') $downloadeddata=true;
			if($booking.issues!='') $downloadeddata=true;
			
			if($storedbookingdata[$bookingid]) {
			  $bookingdata[$bookingid] = $storedbookingdata[$bookingid];
			  // check individual timing comparison?
			  }
			else {
			  if($downloadeddata) $bookingdata[$bookingid] = $booking;
			  }

			$downloadedriskassessmentdata = false;
			$riskassessment.rastartedtimestamp = $jobanddataarray[$bookingid].rastartedtimestamp;
			$riskassessment.customerra = $jobanddataarray[$bookingid].customerra;
			$riskassessment.evacuation = $jobanddataarray[$bookingid].evacuation;
			$riskassessment.manualhandling = $jobanddataarray[$bookingid].manualhandling;
			$riskassessment.electricalsafety = $jobanddataarray[$bookingid].electricalsafety;
			$riskassessment.electricalsafetynotes = $jobanddataarray[$bookingid].electricalsafetynotes;
			$riskassessment.electricalsafetyescalationnotes = $jobanddataarray[$bookingid].electricalsafetyescalationnotes;	
			$riskassessment.asbestos = $jobanddataarray[$bookingid].asbestos;	
			$riskassessment.workingatheight = $jobanddataarray[$bookingid].workingatheight;
			$riskassessment.additionalrisks = $jobanddataarray[$bookingid].additionalrisks;
			$riskassessment.additionalrisksnotes = $jobanddataarray[$bookingid].additionalrisksnotes;
			$riskassessment.confirmation = $jobanddataarray[$bookingid].confirmation;
			$riskassessment.status = $jobanddataarray[$bookingid].status;
			$riskassessment.racompletedtimestamp = $jobanddataarray[$bookingid].racompletedtimestamp;
			if($riskassessment.rastartedtimestamp!='') $downloadedriskassessmentdata=true;
			if($riskassessment.customerra!='') $downloadedriskassessmentdata=true;
			if($riskassessment.evacuation!='') $downloadedriskassessmentdata=true;
			if($riskassessment.manualhandling!='') $downloadedriskassessmentdata=true;
			if($riskassessment.electricalsafety!='') $downloadedriskassessmentdata=true;
			if($riskassessment.electricalsafetynotes!='') $downloadedriskassessmentdata=true;
			if($riskassessment.electricalsafetyescalationnotes!='') $downloadedriskassessmentdata=true;
			if($riskassessment.asbestos!='') $downloadedriskassessmentdata=true;
			if($riskassessment.workingatheight!='') $downloadedriskassessmentdata=true;
			if($riskassessment.additionalrisks!='') $downloadedriskassessmentdata=true;
			if($riskassessment.additionalrisksnotes!='') $downloadedriskassessmentdata=true;
			if($riskassessment.confirmation!='') $downloadedriskassessmentdata=true;
			if($riskassessment.status!='') $downloadedriskassessmentdata=true;
			if($riskassessment.racompletedtimestamp!='') $downloadedriskassessmentdata=true;
			
			if($storedriskassessmentdata[$bookingid]) {
			  $riskassessmentdata[$bookingid] = $storedriskassessmentdata[$bookingid];
			  // check individual timing comparison?
			  }
			else {
			  if($downloadedriskassessmentdata) $riskassessmentdata[$bookingid] = $riskassessment;
			  }
			  
            } // end of if hasownproperty
          }  // end of for loop		
		  
		$jobarray.sort(compare);  

		$.mobile.loading('hide');
		  
	    var $jsonjobarray = JSON.stringify($jobarray);
        localStorage.removeItem("jsonjobarray");
        localStorage.setItem("jsonjobarray",$jsonjobarray);
	    var $jsonbookingdata = JSON.stringify($bookingdata);
        localStorage.removeItem("jsonbookingdata");
        localStorage.setItem("jsonbookingdata",$jsonbookingdata);
	    var $jsonriskassessmentdata = JSON.stringify($riskassessmentdata);
        localStorage.removeItem("jsonriskassessmentdata");
        localStorage.setItem("jsonriskassessmentdata",$jsonriskassessmentdata);
	    callback(true); 
	    }); // end of $post
		
		
	  } // end of online code
    else { // offline code here
  	  callback(false);
	  } // end of offline code
	}); // end of onlinecheck
  
  } // end of downloadjobs
  
function compare(a,b) {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  return 0;
  }
  
function onlinecheck(callback) {
  $rootpath = localStorage.getItem("rootpath");
  $.ajax({
    cache: false,
    type: 'GET',
    url: $rootpath + 'online.txt',
    timeout: 2000,
    success: function(data, textStatus, XMLHttpRequest) {
      if (data = 'online') callback(true);
      else callback(false); },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      callback(false); }
    });
  }
  
function alertshowingonlinestatus() {
  onlinecheck(function(result) {
    if(result==true) { // online code here
	  alert("ONLINE");
	  } // end of online code
	else { // offline code here
  	  alert("OFFLINE");
	  } // end of offline code
	}); // end of onlinecheck
  }
  
function checkonlinestatus() {
  onlinecheck(function(result) {
    if(result==true) { // online code here
	  return true;
	  } // end of online code
	else { // offline code here
  	  return false;
	  } // end of offline code
	}); // end of onlinecheck
  }

function gettodaytimestamp() { // WORKS ONLINE AND OFFLINE
  var $gtt_now = new Date();
  var $gtt_todaydate = $gtt_now.getDate();
  if($gtt_todaydate<10) $gtt_todaydate = '0' + $gtt_todaydate;
  var $gtt_todaymonth = $gtt_now.getMonth() + 1;
  if($gtt_todaymonth<10) $gtt_todaymonth = '0' + $gtt_todaymonth;
  var $gtt_todayyear = $gtt_now.getFullYear();
  var $gtt_todaystring = $gtt_todayyear+'-'+$gtt_todaymonth+'-'+$gtt_todaydate;
  var $gtt_todaytimestamp = new Date($gtt_todaystring).getTime() / 1000;
  return $gtt_todaytimestamp;
  } // end of gettodaytimestamp
  
function autocomplete(callback) {   // WORKS ONLINE AND OFFLINE
  // does a cycle through all jobs stored locally and autocompletes any that have passed and are eligable for auto complete
  var $ac_changed = false;
  var $ac_todaytimestamp = gettodaytimestamp();
  var $ac_bookingdata = {};
  var $ac_jobarray = {};
  var $ac_jsonbookingdata = localStorage.getItem("jsonbookingdata");
  if($ac_jsonbookingdata) $ac_bookingdata = JSON.parse($ac_jsonbookingdata);
  var $ac_jsonjobarray = localStorage.getItem("jsonjobarray");
  if($ac_jsonjobarray) $ac_jobarray = JSON.parse($ac_jsonjobarray); 
  var $ac_jsonautocompletetypes = localStorage.getItem("jsonautocompletetypes");
  if($ac_jsonautocompletetypes) $ac_autocompletetypes = JSON.parse($ac_jsonautocompletetypes);
  // loop through bookings 
  for (var $ac_item in $ac_jobarray) {
    // some browsers add more properties to every object, we don't want those
    if ($ac_jobarray.hasOwnProperty($ac_item)) {
      var $ac_jobarrayid = $ac_item;
      var $ac_bookingid = $ac_jobarray[$ac_jobarrayid].bookingid;
      var $ac_bookingtimestamp = new Date($ac_jobarray[$ac_jobarrayid].date).getTime() / 1000;   
      var $ac_datepassed = false;
      if($ac_bookingtimestamp<$ac_todaytimestamp) $ac_datepassed = true;
      if($ac_datepassed) {
        // loop through types
        for (var $ac_typeitem in $ac_autocompletetypes) {
          // some browsers add more properties to every object, we don't want those
          if ($ac_autocompletetypes.hasOwnProperty($ac_typeitem)) {
            var $ac_type = $ac_typeitem;
            if($ac_jobarray[$ac_jobarrayid].type == $ac_type) { // complete it
			  if($ac_bookingdata[$ac_bookingid]) {
			    $ac_bookingdata[$ac_bookingid].complete = 'yes';
				}
			  else {
                var $ac_booking = {
                  departtime: '-',
                  starttime: '-',
                  finishtime: '-',
                  returntime: '-',
                  completiondetailid: '0',
                  complete: 'yes',
                  edited: 'no'  
                  };
				$ac_bookingdata[$ac_bookingid] = $ac_booking;
			    }
			  $ac_changed = true;			  
			  } // end of if types match
		    } // end of if has own property
		  } // end of for loop going through each autocomplete type
		} // end of if date passed
      } // end of if jobarray entry hasownproperty
    } // end of for loop	
  if($ac_changed) { // write array back to local storage
    var $ac_updatedjsonbookingdata = JSON.stringify($ac_bookingdata);
    localStorage.setItem("jsonbookingdata",$ac_updatedjsonbookingdata);		  
	} // end of if changed
  callback();
  } // end of autocomplete
	
