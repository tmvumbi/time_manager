angular.module('app').controller('dashboardController',
    function (
        $scope,
        $state,
        $timeout,
        utilService,
        dashboardService) {

        /**
         * INTERFACES TO
         * =============
         * dashboardService (which contains the business logic) 
         * and utilService
         */

        /** This function creates a new workession
         *  and swiches the ui to 'work_session' state or page.
         */
        $scope.createNewWorkSession = function () {
            //Create and persist the session
            var workSession = dashboardService.createNewWorkSession(
                $scope.workSessionConfig.workSessionCategory,
                $scope.workSessionConfig.workSessionName,
                $scope.workSessionConfig.plannedWorkTime,
                $scope.workSessionConfig.numberOfTimeSlotsByBlock,
                $scope.workSessionConfig.durationTimeSlot,
                $scope.workSessionConfig.durationReflection,
                $scope.workSessionConfig.objectives,
                $scope.workSessionConfig.catchUpTimeConfig,
                $scope.workSessionConfig.timeSlotConfig
            );

            // Reload the worksession screen
            $timeout(function () {
                $state.go("work_session");
            }, 300);

        }

        /** This function formats the date */
        $scope.formatDate = function (dateString) {
            return utilService.formatDate(dateString);
        }

        /** This function formats the duration
         *  the parameter 'duration' is an integer
         *  representing the duration in seconds
         */
        $scope.formatDuration = function (duration) {
            return utilService.formatDuration(duration);
        }

        /** This variable contains the default configuration
         *  needed to create a new worksession
         */
        $scope.workSessionConfig = dashboardService.getInitialWorkSessionConfig();

        /** This array contains the collection of worksession objects */
        $scope.workSessionCollection = [];

        /** This function reads the workSession collection from either localstorage or the cloud  */
        var getWorkSessionCollection = function () {
            $scope.loading = true;
            dashboardService.getWorkSessionCollection(function (_worksessionCollection) {
                $timeout(function () {
                    $scope.workSessionCollection = _worksessionCollection;
                    if ($scope.workSessionCollection!=null){
                        $scope.workSessionCollection.reverse();
                    }
                    $scope.loading = false;
                });
            });
        }

        /** This call allows initializing the collection of worksession objects when
         * the dashboard page is loaded
         */
        getWorkSessionCollection();

        /** This private function retrieve the last workSession created
         *  It is used to initialize a new worksession configuration
         *  using the config from the last session as a model
         */
        var getLastWorkSession = function () {
            if ($scope.workSessionCollection == null) return null;
            if ($scope.workSessionCollection.length > 0) {
                return $scope.workSessionCollection[0];
            }
        }

        /**
         *  TABLE FILTER (OR SEARCH) LOGIC
         *  ==============================
         */

        /** This object contains the search criteria */
        $scope.search = {
            byCategoryOrName: "",
            byDateFrom: new Date(),
            byDateTo: new Date()
        }

        /** The 'From date' in the filter is initialized 7 days before current date by default */
        $scope.search.byDateFrom.setDate($scope.search.byDateFrom.getDate() - 7);

        /** This array contains the filtered list (with record matching the search criterion) */
        $scope.filteredList = [];

        /** This watcher is triggered when any of the search criteria changes
         *  or when the size of the workSessionCollection changes.
         *  It contains the logic that filter the main list (workSessionCollection)
         *  and populates the filtered list (filteredList)
         */
        $scope.$watchGroup([
            'search.byCategoryOrName',
            'search.byDateFrom',
            'search.byDateTo',
            'workSessionCollection.length'],
            function (newValue, oldValue) {
                $scope.filteredList.splice(0); // the filteredList is emptied each time a search criteria or the size of the original list (workSessionCollection) changes
                $scope.currentPage = 1; // reset the current page to 1 (for pagination)
                newValue[1].setHours(0, 0, 0, 0); // sets the time to 12:00 AM for search.byDateFrom (contained in newValue[1])
                newValue[2].setHours(0, 0, 0, 0); // sets the time to 12:00 AM for search.byDateTo (contained in newValue[2])
                newValue[2].setDate(newValue[2].getDate() + 1); // add one day to search.byDateTo (to avoid a difference of 0 when fromDate = toDate)
                /** includes in filteredList only records for which worksession.id (containing the date of creation) 
                 * is between search.byDateFrom and search.byDateTo
                 * and worksession.category contains search.category 
                 * */
                if ($scope.workSessionCollection!=null){
                    for (var i = 0; i < $scope.workSessionCollection.length; i++) {
                        var ws = $scope.workSessionCollection[i];
                        if (newValue[0] !== undefined && ws.workSessionCategory !== undefined) {
                            if ((ws.workSessionCategory.toLowerCase().indexOf(newValue[0].toLowerCase()) != -1
                                || ws.workSessionName.toLowerCase().indexOf(newValue[0].toLowerCase()) != -1)
                                && ws.id <= newValue[2] && ws.id >= newValue[1]
                            ) {
                                $scope.filteredList.push(ws);
                            }
                        }
                    }
                }
            });

        /**
         *  TABLE PAGINATION LOGIC
         *  ======================
         */

        /** Intialization of variable used for pagination */
        $scope.pageSize = 5; // number of items per page
        $scope.currentPage = 1; // the current page (starts from 1)

        /** This function retrieves a 'slice' to display 
         *  the max number of items in the slice is given by $scope.pageSize
         */
        $scope.getSliceList = function () {
            var result = [];
            for (var i = ($scope.currentPage - 1) * $scope.pageSize; i < $scope.currentPage * $scope.pageSize; i++) {
                if ($scope.filteredList[i] !== undefined) {
                    result.push($scope.filteredList[i]);
                } else {
                    return result;
                }
            }
            return result;
        }

        /** This function returns an array containing page indexes
         * If there are 3 pages to display, the array will be [1,2,3]
         */
        $scope.getPages = function () {
            var pages = [];
            for (var i = 1; i <= Math.ceil($scope.filteredList.length / $scope.pageSize); i++) {
                pages.push(i);
            }
            if (pages.length == 0) {
                pages.push(1);
            }
            return pages;
        }

        /** This function returns the index of the last page */
        $scope.getLastPage = function () {
            if ($scope.filteredList.length == 0) {
                return 1;
            } else {
                return Math.ceil($scope.filteredList.length / $scope.pageSize);
            }
        }

        /** This function allows changing the current page */
        $scope.selectPage = function (page) {
            $scope.currentPage = page;
        }

        /** This function allows moving to the next page */
        $scope.nextPage = function () {
            if ($scope.currentPage != $scope.getLastPage()) {
                $scope.currentPage++;
            }
        }

        /** This function allows moving to the previous page */
        $scope.previousPage = function () {
            if ($scope.currentPage != 1) {
                $scope.currentPage--;
            }
        }

        /**
         * UI EVENT FUNCTIONS
         * ==================
         */

        /* This function deletes the worksession object in the parameter 
           from the localstorage or the cloud */
        $scope.deleteWorkSession = function (workSession) {
            for (var i = 0; i < $scope.workSessionCollection.length; i++) {
                if ($scope.workSessionCollection[i].id == workSession.id) {
                    dashboardService.deleteWorkSession($scope.workSessionCollection[i]);
                    $scope.workSessionCollection.splice(i, 1);
                    return;
                }
            }
        }

        /** This function allows displaying the configuration for catch up time */
        $scope.displayMoreConfig = function () {
            $scope.showMoreConfig = true;
        }

        /** This function initializes the default configuration 
         *  when a new workession is being created,
         *  using the config from the most recent worksession created
         */
        $scope.startNewWorkSession = function () {
            var lastWorkSession = getLastWorkSession();

            if (lastWorkSession != null) {
                $scope.workSessionConfig.timeSlotConfig = lastWorkSession.timeSlotConfig;
                $scope.workSessionConfig.workSessionCategory = lastWorkSession.workSessionCategory;
                $scope.workSessionConfig.plannedWorkTime = lastWorkSession.plannedWorkTime;
                $scope.workSessionConfig.numberOfTimeSlotsByBlock = lastWorkSession.numberOfTimeSlotsByBlock;
                $scope.workSessionConfig.durationTimeSlot = lastWorkSession.durationTimeSlot;
                $scope.workSessionConfig.durationReflection = lastWorkSession.durationReflection;
                $scope.workSessionConfig.catchUpTimeConfig = lastWorkSession.catchUpTimeConfig;
            }
        }

        /** This function persists the workSession object in the parameter
         *  and switches to 'work_session' page (or state) */
        $scope.loadWorkSession = function (workSession) {
            dashboardService.persistWorkSession(workSession);
            $state.go("work_session");
        }
    }); 