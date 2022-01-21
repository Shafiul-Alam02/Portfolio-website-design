var app = new Vue({
    delimiters: ['$((', '))'],
    el: "#app",
    data: {
        baseUrl: document.querySelector("input[name=baseUrl]").value,
        imagePath: document.querySelector("input[name=imagePath]").value,
        modal: false,
        modalData: [],
        modalOpenIndex: 0,
        errorMsg: '',
        title: '',
        intro: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        option5: '',
        option_desc: '',
        data: '',
        buttonsData: '',
        segments: '',
        segmentId: '',
        checked: false,
        clientWell: false,
        getOptions: [],
        clickedOption: ''

    },


    mounted: function() {
        // console.log('ok');
        this.getSegments();



    },

    methods: {


        getSegments: function() {
            axios.get(this.baseUrl + '/api/segments').then(function(result) {
                if (result.data.error) {
                    // app.errorMsg = score.data.message;
                } else {
                    data = result.data;
                    // console.log(result.data);
                    app.segments = result.data;

                    app.segments.forEach((item, index) => {
                        // console.log(index);
                        app.assignedSegments(item, index);
                    });

                }
            });
        },

        assignedSegments: async function(data, index) {
            app.getOptions = [];
            app.clientWell = false;
            app.buttonsData = null;
            app.segmentId = data.id;
            app.title = data.title;
            app.intro = data.intro;
            app.option1 = data.option1;
            app.option2 = data.option2;
            app.option3 = data.option3;
            app.option4 = data.option4;
            app.option5 = data.option5;
            app.checked = false;
            await app.getAllOptionsData(index, data.id, 2, data.option2_desc);
            await app.getAllOptionsData(index, data.id, 3, data.option3_desc);
            await app.getAllOptionsData(index, data.id, 4, data.option4_desc);
        },

        getAllOptionsData: function(index, segmentId, opt, desc) {
            axios.get(`${this.baseUrl}/api/getAlldataBySegmentsAndoption/${segmentId}/${opt}`).then(function(result) {
                if (result.data.error) {
                    // app.errorMsg = score.data.message;
                } else {
                    data = result.data;
                    if (data.length > 1) {

                        app.getOptions.push({
                            index: index,
                            segmentId: segmentId,
                            option: opt,
                            option_desc: desc,
                            optionData: data

                        });

                    } else {
                        app.buttonsData = null;
                    }
                    // console.log(app.getOptions);

                }
            });

        },

        openOptionBox: function(index, segmentId, option) {
            // console.log(option);
            // console.log(app.getOptions);

            app.clientWell = false;
            const data = app.getOptions.filter(function(data) {
                if (data.segmentId == segmentId && data.option == option) {
                    return true;
                }

            });

            // console.log(data);
            // console.log(app.segmentId);
            app.option_desc = data[0].option_desc;
            app.buttonsData = data[0].optionData;
            app.clickedOption = data[0].index;
            // console.log(app.buttonsData);

            app.clientWell = true;

            // new SimpleBar(document.getElementById('clientWell'), { autoHide: true });
        },

        scrollToEnd() {
            var container = document.querySelector(".client-info");
            var scrollHeight = container.scrollHeight;
            container.scrollTop = scrollHeight;
        },

        modalopen: function(data, key) {
            pathname = window.location.pathname;
            window.history.pushState(data, data.title, app.baseUrl + "/" + data.title);


            window.onpopstate = function(event) {
                hash = window.location.hash;
                changedUrl = window.location.href;
                changedUrl = changedUrl.replace(hash, '');
                console.log(changedUrl);
                if (changedUrl == app.baseUrl + "/") {
                    this.app.modalClose();
                }
            };


            app.modalData = data;
            app.modalOpenIndex = key;
            // console.log(app.modalData);
            app.modal = true;
            app.clientWell = false;
            list = document.querySelectorAll(".modalbutton");
            // console.log(list);
        },

        modalClose: function() {
            pathname = window.location.pathname;
            window.history.pushState(data, data.title, app.baseUrl);
            app.modal = false;
        },

        nextItem: function() {
            i = app.modalOpenIndex;
            i = i + 1; // increase i by one
            i = i % app.buttonsData.length;
            app.modalOpenIndex = i;
            app.modalData = app.buttonsData[app.modalOpenIndex];
            document.querySelector('.click-' + app.modalOpenIndex).click();

        },

        prevItem: function() {
            i = app.modalOpenIndex;
            if (i === 0) { // i would become 0
                i = app.buttonsData.length; // so put it at the other end of the app.buttonsDataay
            }
            i = i - 1; // decrease by one
            app.modalOpenIndex = i;
            app.modalData = app.buttonsData[app.modalOpenIndex]; // give us back the item of where we are now
            document.querySelector('.click-' + app.modalOpenIndex).click();
        },

        close: function() {
            app.buttonsData = null;
            app.clientWell = false;
        }


    },



});


// var spinner = document.getElementById("spinner");
// spinner.style.display = "none";

var isInViewport = function(elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};