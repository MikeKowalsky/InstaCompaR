
		$(document).ready(function() {

		//  This is basic - uses default settings 
		
		// $("a#single_image").fancybox();
		
		/* Using custom settings */
		
		$("a.single_image").fancybox({
			'hideOnContentClick': true,
			'enableEscapeButton': true
		});

		// /* Apply fancybox to multiple items */
		
		// $("a.group").fancybox({
		// 	'transitionIn'	:	'elastic',
		// 	'transitionOut'	:	'elastic',
		// 	'speedIn'		:	600, 
		// 	'speedOut'		:	200, 
		// 	'overlayShow'	:	false
		// });
	
	});


	let profilesFromFile = ramdomProfiles;
	let randNoArray = [];
	let urlsArray = [];
	let randProfArray = [];

	do {
		let randomNo = parseInt(Math.random() * 100);
		if (!(randNoArray.includes(randomNo))){
			randNoArray.push(randomNo);
		}
	} while (randNoArray.length !== 12);
	// console.log(randNoArray);

	randNoArray.forEach((no) => {
		let url = 'https://www.instagram.com/' + profilesFromFile[no] + '/?__a=1';
		// console.log(url);
		urlsArray.push(url);
	})
	console.log(urlsArray);
	
	let count = 0;
	urlsArray.forEach((url) => {
			$.getJSON(url, function(data){
		      let getProfile = data.graphql.user;
		      //test: show element
		      // console.log(getProfile);
		      console.log(getProfile.username);
		      randProfArray.push(getProfile);
		      count++;
		      if (count == 12){
		      	something(randProfArray);
		      }
  		})
	})

	// var mainData = [id3582115, id723531113, id261998995, id362405136,id34026859, id1735458172, id174618945, id44222792, id6281714, id6459664];

	function something (mainData){
		console.log(mainData);
		mainData.sort((a, b) => b.edge_followed_by.count - a.edge_followed_by.count);
		console.log(mainData);

		let vueElement = new Vue({
		el: '#app',
		data: {
			test: 'Hello People',
			mainArray: mainData,
			onePerson: mainData[0].edge_owner_to_timeline_media.edges,
			personsPosts: [],
			keyword: '',
			chartAvg: [],
			chartFollowedByAll: [],
			chartLikesInPosts: [],
			loaded: false,
			showPosts: false,
			secPostWin: [],
			postParam: '',
			showCharts: true,
			cloudObj: null,
			compareProfilCounter: 0

		},
		created: function(){
			this.avgLikePerPost();
			this.noOfLikesPlus();
			this.createPersonsPostsArray();
      this.analizeTags();
      this.loaded = true; // loader off
		},
		methods: {
			createPersonsPostsArray: function(){
				// console.log('in createPersonsPostsArray: ');
				console.log(this.personsPosts.length);
				if (this.personsPosts.length > 0){
					this.personsPosts[0] = this.mainArray[0].edge_owner_to_timeline_media.edges;
				} else {
					for(let i = 0; i < this.mainArray.length; i ++){
						this.personsPosts.push(this.mainArray[i].edge_owner_to_timeline_media.edges);
					}
				}
				// console.log(this.personsPosts);
			},
			avgLikePerPost: function(){
				console.log('in avgLikePerPost');

				let likesPerPhotoAr = [];
				this.mainArray.forEach((profile) => { 
					let sum = 0;
					let counter = 0;
					for (let i = 0; i < profile.edge_owner_to_timeline_media.edges.length; i ++){
						sum += profile.edge_owner_to_timeline_media.edges[i].node.edge_liked_by.count;
						counter++;
					}
					likesPerPhotoAr.push(Math.round(sum/counter));
					profile.avgLikePerPost = Math.round(sum/counter);
				})
				console.log(likesPerPhotoAr);
				console.log(this.mainArray);

				// <pie-chart :data="[['Blueberry', 44], ['Strawberry', 23]]"></pie-chart>
				
				let newObjectChart = [];
				this.mainArray.forEach((profile) => {
					let tempArray = [];
					tempArray.push(profile.username);
					tempArray.push(profile.avgLikePerPost);
					newObjectChart.push(tempArray);
				});
				console.log('to chart no4: ');
				console.log(newObjectChart);
				this.chartAvg = newObjectChart;
			},
			noOfLikesPlus: function() {
				
				// chart no5
				let tempChartArray1 = [];
				this.mainArray.forEach((profile) => {
					let tempArray = [];
					tempArray.push(profile.username);
					tempArray.push(profile.edge_followed_by.count);
					tempChartArray1.push(tempArray);
				});
				console.log('to chart no5: ');
				console.log(tempChartArray1);
				this.chartFollowedByAll = tempChartArray1;

				// chart no6
				// data = [
				//   {name: 'Workout', data: {'2017-01-01 00:00:00 -0800': 3, '2017-01-02 00:00:00 -0800': 4}},
				//   {name: 'Call parents', data: {'2017-01-01 00:00:00 -0800': 5, '2017-01-02 00:00:00 -0800': 3}}
				// ];

				console.log('to chart no6: ');
				let tempChartArray2 = [];

				this.mainArray.forEach((profile, index) => {
					tempChartArray2.push({ 
						"name" : profile.username,
						"data" : {}
					});
					// console.log('tempChartArray2 test: ');
					// console.log(tempChartArray2);
					// console.log(tempChartArray2[0].data);
					let counter = 1;
					console.log(profile.edge_owner_to_timeline_media.edges.length);
					profile.edge_owner_to_timeline_media.edges.forEach((post) => {
						tempChartArray2[index].data[counter] = post.node.edge_liked_by.count;
						// tempChartArray2[index].data[post.node.edge_liked_by.count] = counter;
						counter++;
						// tempChartArray2[i].data.push(post.node.edge_liked_by.count);
					});
				});
				
				console.log(tempChartArray2);
				this.chartLikesInPosts = tempChartArray2;

			},
			//marszalek.kowalewska
			compareProfile: function(){
				console.log('in compareProfile');
				console.log(this.keyword);
				// console.log(this.mainArray[0]);
				let newUrl = 'https://www.instagram.com/' + this.keyword + '/?__a=1';
				$.getJSON(newUrl, function(myProfile){
					vueElement.mainArray[vueElement.compareProfilCounter] = myProfile.graphql.user;
					vueElement.compareProfilCounter++;
					vueElement.avgLikePerPost();
					vueElement.noOfLikesPlus();
					vueElement.createPersonsPostsArray();
					vueElement.analizeTags();
				})
				console.log("compareProfilCounter: " + this.compareProfilCounter);
			},
			showPostsElement: function(id){
				console.log('in showPostsElement');
				console.log(id);

				this.mainArray.forEach((profile) => {
					if(profile.id == id){
						this.secPostWin = profile.edge_owner_to_timeline_media.edges;
					}
				})
				this.showPosts = true;
				console.log(this.secPostWin);
			},
			showChartsMeth: function(){
				// this.showCharts = !this.showCharts;
			},
			analizeTags: function(){

				let textArray = []; //all texts from posts
				this.mainArray.forEach((profile) => {
					for(let i = 0; i < profile.edge_owner_to_timeline_media.edges.length; i++){
						if (profile.edge_owner_to_timeline_media.edges[i].node.edge_media_to_caption.edges.length > 0){
							textArray.push(profile.edge_owner_to_timeline_media.edges[i].node.edge_media_to_caption.edges[0].node.text);
						}
					}
				})
				// console.log(textArray);
				let splittedTextArray = []; //splitted text - every word
				textArray.forEach((text) => splittedTextArray.push(text.split(' ')));
				// console.log(splittedTextArray);
				let tagArray = []; //only tags with #
				splittedTextArray.forEach((text) => {
					text.forEach((word) => {
						if (word[0] == '#'){
							tagArray.push(word);
						}
					})
				})
				// console.log(tagArray);
				tagArray = tagArray.map((tag) => tag.slice(1)); //without #
				// console.log(tagArray);

				let tagObj = []; //frequency
				tagArray.forEach((tag) => tagObj[tag] ? tagObj[tag]++ : tagObj[tag] = 1);
				// console.log(tagObj);
				
				tagObj = Object.keys(tagObj).map((key) => { //change format
					return {
						name: key, 
						total: tagObj[key]
					};
				});
				tagObj.sort((a, b) => b.total - a.total); //sort
				let repeatedTagObj = []; //only when appears more than one
				tagObj.forEach((tag) => {
					if(tag.total > 1){
						repeatedTagObj.push(tag);
					}
				});
				// console.log('repeatedTagObj');
				// console.log(repeatedTagObj);

				let wordCloudArray = tagObj.map((obj) => {
					let returnObj = [];
					returnObj.push(obj.name);
					returnObj.push(obj.total);
					// rObj[obj.name] = obj.total;
					return returnObj;
				});
				this.cloudObj = wordCloudArray;
				console.log(wordCloudArray);

				// createCloud(wordCloudArray);
			}
		}
	})

	// let list = [['foo', 12], ['bar', 6]];
	let list = vueElement.cloudObj;
	let options = 
	{
		list: list,
		gridSize: 15,
  	weightFactor: 5,
  	fontWeight:'bold'
	}
	WordCloud.minFontSize = "15px";
	WordCloud(document.getElementById('my_canvas'), options);

	}
	
	function createCloud (data){

		console.log('in createCloud');
		console.log(data);


		let list = data;
		let options = 
			{
				list: list,
				gridSize: 15,
		  	weightFactor: 5,
		  	fontWeight:'bold'
			}

		//remove old element & add new one
		// $(document).ready(function(){
		// 	$("#my_canvas").remove();
		// 	$("#canvasParent").append("<canvas id=\"my_canvas\" width=\"1520\" height=\"760\" style=\"width: 760px; height: 380px\">cloud1</canvas>\"");
		// });

		WordCloud.minFontSize = "15px";
		WordCloud(document.getElementById('my_canvas'), options);
	}




