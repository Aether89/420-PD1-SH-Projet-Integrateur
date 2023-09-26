<template>
    <v-container fluid justify="center">
        <v-row>
            <v-col cols="5" class="flex d-flex justify-center">
                <v-pagination :total-visible="7" :length="this.pagination" v-model="page"></v-pagination>
            </v-col>
            <v-col cols="1">
            </v-col>
            <v-col cols="5">
                <v-pagination v-if="this.myPagination > 1" :total-visible="7" :length="this.myPagination" v-model="myPage"></v-pagination>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="5" class="flex d-flex justify-center">
                <v-list bg-color="grey-lighten-3" v-for="(day, index) in this.availability.slice(this.currentIndex, this.currentIndex + this.totalDayToDisplay)" width="110" height="360">
                    <v-list-item-title class="mb-8" style="position: sticky; top: 0;">{{ day.date }}</v-list-item-title>
                    <v-checkbox class="my-n8" v-for="block in day.block" v-model="selectedTimeSlot"
                        :value="{ date: block.date, time: block.time, status: block.status }"
                        :label="block.time"></v-checkbox>
                </v-list>
                </v-col>
            <v-col cols="1" class="flex-horizontal">
                <v-btn class="ma-1" @click="this.addTimeSlot(selectedTimeSlot, myAvailability, availability)">Ajouter</v-btn>
                <v-btn class="ma-1" @click="this.addTimeSlot(toRemoveTimeSlot, availability, myAvailability)">Retirer</v-btn>
                <v-spacer></v-spacer>
                <v-btn :disabled="!canSubmit" class="ma-1" @click="submit">Soumettre</v-btn>

            </v-col>
            <v-col cols="5" class="flex d-flex justify-center">
                <v-list bg-color="grey-lighten-3" v-for="mday in this.myAvailability.slice(this.myCurrentIndex, this.myCurrentIndex + this.totalDayToDisplay)" width="110" height="360">
                    <v-list-item-title class="mb-8" style="position: sticky; top: 0;">{{ mday.date }}</v-list-item-title>
                    <v-checkbox class="my-n8" v-for="block in mday.block" v-model="toRemoveTimeSlot"
                        :value="{ date: block.date, time: block.time, status: block.status }"
                        :label="block.time"></v-checkbox>
                </v-list>
            </v-col>

        </v-row>

        <v-row >
            <p>{{ this.selectedTimeSlot }}</p><br>

            <p>{{ this.toRemoveTimeSlot }}</p> <br>
            <p>{{ this.removedAvailability }}</p>
        </v-row>

    </v-container>
</template>

  
<script>

import session from '../../session.js';
export default {
    data() {
        return {
            canSubmit: false,
            currentIndex: 0,
            myCurrentIndex: 0,
            session: session,
            startTime: 9,
            endTime: 20,
            page: 1,
            myPage: 1,
            totalDayToDisplay: 5,
            totalDays: 15,
            availability: [],
            receivedAvailability: [{ "date": "2023/9/26", "block": [{ "date": "2023/9/26", "time": "11:00", "status": "old" }, { "date": "2023/9/26", "time": "12:00", "status": "old" }] }, { "date": "2023/9/30", "block": [{ "date": "2023/9/30", "time": "12:00", "status": "old" }, { "date": "2023/9/30", "time": "16:00", "status": "old" }] }],
            myAvailability: [{ "date": "2023/9/26", "block": [{ "date": "2023/9/26", "time": "11:00", "status": "old" }, { "date": "2023/9/26", "time": "12:00", "status": "old" }] }, { "date": "2023/9/30", "block": [{ "date": "2023/9/30", "time": "12:00", "status": "old" }, { "date": "2023/9/30", "time": "16:00", "status": "old" }] }],
            removedAvailability: [],
            timeBlock: 60,
            selectedTimeSlot: [],
            toRemoveTimeSlot: [],
        };
    },
    methods: {
        async generateAvailability() {

            for (let i = 0; i < this.totalDays; i++) {
                let day = new Date();
                day.setDate(day.getDate() + i);
                let dayArray = [];

                dayArray = (this.generateTimeArray(this.startTime, this.endTime, this.timeBlock, day));

                const dayObj = {
                    date: (day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()),
                    block: dayArray,
                };
                this.availability.push(dayObj);
            }
        },
        generateTimeArray(startTime, endTime, timeBlock, day) {
            let timeArray = [];
            let currentTime = new Date();
            currentTime.setHours(startTime);
            currentTime.setMinutes(0);
            while (currentTime.getHours() < endTime) {
                let hours = currentTime.getHours();
                let minutes = currentTime.getMinutes();

                let timeString = {
                    date: (day.getFullYear() + '/' + (day.getMonth() + 1) + '/' + day.getDate()),
                    time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
                    status: 'new'
                }
                timeArray.push(timeString);
                currentTime.setMinutes(currentTime.getMinutes() + timeBlock);
            }
            return timeArray;
        },

        addTimeSlot(inputArray, outputArray, arrayToClean) {
            (this.canSubmit === false)? this.canSubmit = true: null;
            var output = outputArray.reduce((acc, curr) => {
                acc[curr.date] = curr.block;
                return acc;
            }, {});

            inputArray.forEach(item => {
                let date = item.date;

                if (!output[date]) {
                    output[date] = [];
                }

                if (!output[date].some(block => block.time === item.time)) {

                    output[date].push(item);
                }
            });

            outputArray.splice(0, outputArray.length, ...Object.keys(output).map(date => ({ date: date, block: output[date] })));

            outputArray.forEach(day => {
                day.block.sort((a, b) => {
                    return a.time.localeCompare(b.time);
                });
            });

            outputArray.sort((a, b) => {
                return new Date(a.date) - new Date(b.date);
            });

            this.removeFromAvailability(arrayToClean, outputArray);
            inputArray.splice(0, inputArray.length);

            this.canSubmit = !this.isOriginal();
        },

        removeFromAvailability(arrayToClean, inputArray) {
            let newArray = arrayToClean.map(day => {
                let myDay = inputArray.find(d => d.date === day.date);
                if (myDay) {
                    return {
                        ...day,
                        block: day.block.filter(timeBlock => !myDay.block.some(myTimeBlock => myTimeBlock.time === timeBlock.time))
                    };
                }
                return day;
            }).filter(day => day.block.length > 0);

            arrayToClean.splice(0, arrayToClean.length, ...newArray);
        },

        submit() {
            const submitAvailability = {
                toRemove: this.availability.flatMap(day => day.block.filter(block => block.status === "old")),
                toAdd: this.myAvailability.flatMap(day => day.block.filter(block => block.status === "new"))
            }

            console.log("Sent", JSON.stringify(submitAvailability,null,2));

        },
        isOriginal() {
                return JSON.stringify(this.myAvailability) === JSON.stringify(this.receivedAvailability);
        }
    },
    computed: {
        pagination() {
            return Math.ceil(this.availability.length / this.totalDayToDisplay);
        },
        myPagination() {
            return Math.ceil(this.myAvailability.length / this.totalDayToDisplay);
        }
    },
    watch: {
        page(newIndex, oldIndex) {
            this.currentIndex = this.totalDayToDisplay * (this.page - 1);
        },
        myPage(newIndex, oldIndex) {
            this.myCurrentIndex = this.totalDayToDisplay * (this.myPage - 1);
        }
    },
    mounted() {
        this.generateAvailability();
        this.removeFromAvailability(this.availability, this.myAvailability);
    },
}

</script> 