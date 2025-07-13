import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    // User plan information
    userPlan: null,
    planLoading: false,
    planError: null,

    // Cigarettes tracking
    todayCigarettes: 0,
    cigarettesLoading: false,
    cigarettesError: null,
    cigarettesSuccess: false,

    // Plan progress
    planProgress: {
        daysCompleted: 0,
        totalDays: 0,
        successRate: 0,
        savings: 0
    },

    // Daily tracking
    dailyData: [],
    dailyDataLoading: false,
    dailyDataError: null,

    // Plan statistics
    statistics: {
        totalSaved: 0,
        cigarettesAvoided: 0,
        healthImprovement: 0
    },

    // Goal settings
    goals: {
        dailyGoal: 0,
        weeklyGoal: 0,
        monthlyGoal: 0
    },

    // Milestones
    milestones: [],
    milestonesLoading: false,
    milestonesError: null,
}

const planSlice = createSlice({
    name: 'plan',
    initialState,
    reducers: {
        // User plan actions
        fetchUserPlanRequest: (state) => {
            state.planLoading = true
            state.planError = null
        },
        fetchUserPlanSuccess: (state, action) => {
            state.planLoading = false
            state.userPlan = action.payload
            state.planError = null
        },
        fetchUserPlanFailure: (state, action) => {
            state.planLoading = false
            state.planError = action.payload
        },

        // Today cigarettes actions
        updateTodayCigarettesRequest: (state, action) => {
            console.log('🔄 updateTodayCigarettesRequest triggered:', action.payload);
            state.cigarettesLoading = true
            state.cigarettesError = null
            state.cigarettesSuccess = false
        },
        updateTodayCigarettesSuccess: (state, action) => {
            console.log('✅ updateTodayCigarettesSuccess triggered:', action.payload);
            state.cigarettesLoading = false
            state.cigarettesSuccess = true
            state.cigarettesError = null
            state.todayCigarettes = action.payload.todayCigarettes || action.payload
        },
        updateTodayCigarettesFailure: (state, action) => {
            console.log('❌ updateTodayCigarettesFailure triggered:', action.payload);
            state.cigarettesLoading = false
            state.cigarettesSuccess = false
            state.cigarettesError = action.payload
        },

        // Daily data actions
        fetchDailyDataRequest: (state) => {
            state.dailyDataLoading = true
            state.dailyDataError = null
        },
        fetchDailyDataSuccess: (state, action) => {
            state.dailyDataLoading = false
            state.dailyData = action.payload
            state.dailyDataError = null
        },
        fetchDailyDataFailure: (state, action) => {
            state.dailyDataLoading = false
            state.dailyDataError = action.payload
        },

        // Plan progress actions
        updatePlanProgress: (state, action) => {
            state.planProgress = { ...state.planProgress, ...action.payload }
        },

        // Statistics actions
        updateStatistics: (state, action) => {
            state.statistics = { ...state.statistics, ...action.payload }
        },

        // Goals actions
        setGoals: (state, action) => {
            state.goals = { ...state.goals, ...action.payload }
        },

        // Milestones actions
        fetchMilestonesRequest: (state) => {
            state.milestonesLoading = true
            state.milestonesError = null
        },
        fetchMilestonesSuccess: (state, action) => {
            state.milestonesLoading = false
            state.milestones = action.payload
            state.milestonesError = null
        },
        fetchMilestonesFailure: (state, action) => {
            state.milestonesLoading = false
            state.milestonesError = action.payload
        },

        // Local cigarettes update (for immediate UI feedback)
        setTodayCigarettes: (state, action) => {
            state.todayCigarettes = action.payload
        },

        // Clear states
        clearPlanError: (state) => {
            state.planError = null
            state.cigarettesError = null
            state.dailyDataError = null
            state.milestonesError = null
        },

        clearPlanState: (state) => {
            state.cigarettesLoading = false
            state.cigarettesSuccess = false
            state.cigarettesError = null
        },

        resetPlanData: (state) => {
            return initialState
        },
    },
})

export const {
    // User plan actions
    fetchUserPlanRequest,
    fetchUserPlanSuccess,
    fetchUserPlanFailure,

    // Today cigarettes actions
    updateTodayCigarettesRequest,
    updateTodayCigarettesSuccess,
    updateTodayCigarettesFailure,

    // Daily data actions
    fetchDailyDataRequest,
    fetchDailyDataSuccess,
    fetchDailyDataFailure,

    // Plan progress actions
    updatePlanProgress,

    // Statistics actions
    updateStatistics,

    // Goals actions
    setGoals,

    // Milestones actions
    fetchMilestonesRequest,
    fetchMilestonesSuccess,
    fetchMilestonesFailure,

    // Local actions
    setTodayCigarettes,

    // Clear actions
    clearPlanError,
    clearPlanState,
    resetPlanData,
} = planSlice.actions

export default planSlice.reducer