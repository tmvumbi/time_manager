angular.module('app').
    service('speechService', [function () {
        /** Loading audio files */ 
        var audio1 = new Audio('assets/audio/1.mp3');
        var audio2 = new Audio('assets/audio/2.mp3');
        var audio3 = new Audio('assets/audio/3.mp3');
        var audio4 = new Audio('assets/audio/4.mp3');
        var audio5 = new Audio('assets/audio/5.mp3');
        var audioBackToWork = new Audio('assets/audio/back_to_work.mp3');
        var audioBreakIsOver = new Audio('assets/audio/break_is_over_please_get_back_to_work_now.mp3');
        var audioHalfTimeSlot = new Audio('assets/audio/half_the_time_slot_completed.mp3');
        var audioOneMinRemaining = new Audio('assets/audio/one_minute_remaining.mp3');
        var audioTwoMinRemaining = new Audio('assets/audio/two_minutes_remaining_before_end_of_break_time.mp3');
        var audioTimeSlotCompleted = new Audio('assets/audio/time_slot_completed_reflection_time.mp3');
        var audioHalfReflectionCompleted = new Audio('assets/audio/half_reflection_time_completed.mp3');
        
        /** The following functions play audio files */ 
        this.playOne = function(){
            audio1.play();
        }
        
        this.playTwo = function(){
            audio2.play();
        }
        
        this.playThree = function(){
            audio3.play();
        }
        
        this.playFour = function(){
            audio4.play();
        }
        
        this.playFive = function(){
            audio5.play();
        }
        
        this.playBackToWork = function(){
            audioBackToWork.play();
        }
        
        this.playBreakIsOver = function(){
            audioBreakIsOve.play();
        }
        
        this.playHalfTimeSlot = function(){
            audioHalfTimeSlot.play();
        }
        
        this.playOneMinRemaining = function(){
            audioOneMinRemaining.play();
        }
        
        this.playTwoMinRemaining = function(){
            audioTwoMinRemaining.play();
        }
        
        this.playTimeSlotCompleted = function(){
            audioTimeSlotCompleted.play();
        }
        
        this.playHalfReflectionCompleted = function(){
            audioHalfReflectionCompleted.play();
        }
    }])