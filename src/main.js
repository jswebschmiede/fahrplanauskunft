import './style.css'
import axios from 'axios'
import { formatDateForDeepLink, generateDeepLink, getStopFinderURL, findBestStop, updateLocationsList, debounce } from './utils/utils'
import { validateNavigation, showValidationErrors, clearValidationErrors } from './utils/validate'

const toAddress = "Mergelteichstraße 80, 44225 Dortmund";
let destinationId = "";

/**
 * Handles the selection of a location from the results list
 * @param {Object} location - The location object that was selected
 * @param {HTMLElement} listItem - The list item DOM element that was clicked
 * @returns {void}
 */
const handleLocationSelection = (location, listItem) => {
    const fromAddressInput = document.getElementById('fromAddress')
    fromAddressInput.value = location.name

    document.querySelectorAll('.location-item').forEach(item => {
        item.setAttribute('aria-selected', 'false')
        item.classList.remove('bg-blue-50', 'border-blue-500')
        item.classList.add('bg-gray-50', 'border-gray-300')
    })

    listItem.setAttribute('aria-selected', 'true')
    listItem.classList.remove('bg-gray-50', 'border-gray-300')
    listItem.classList.add('bg-blue-50', 'border-blue-500')

    clearValidationErrors()
}

/**
 * Fetches initial data for the destination address
 * @async
 * @returns {Promise<void>}
 */
const fetchInitialData = async () => {
    try {
        const toAddressElement = document.getElementById('toAddress')
        toAddressElement.textContent = toAddress

        const response = await axios.get(getStopFinderURL(toAddress))

        const bestStopElement = document.getElementById('bestStop')
        if (response.data.locations && response.data.locations.length > 0) {
            const bestStop = findBestStop(response.data.locations)
            bestStopElement.textContent = bestStop.name + " - (" + bestStop.coord[0] + ", " + bestStop.coord[1] + ")"

            destinationId = bestStop.id
        } else {
            bestStopElement.textContent = 'Keine Koordinaten gefunden'
        }

        console.log('Initial data fetched:', response.data)

    } catch (error) {
        console.error('Error fetching initial data:', error)
    }
}

/**
 * Handles the search to fetch locations for the entered address
 * @async
 * @returns {Promise<void>}
 */
const handleSearch = async () => {
    const formData = {
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        fromAddress: document.getElementById('fromAddress').value
    }

    if (!formData.fromAddress.trim()) {
        return
    }

    const results = document.getElementById('results')
    results.innerHTML = '<p class="text-gray-600">Suche läuft...</p>'

    try {
        const response = await axios.get(getStopFinderURL(formData.fromAddress))
        console.log('Search results:', response.data)

        updateLocationsList(response.data.locations, handleLocationSelection)

        // If no results found, show error message
        if (!response.data.locations || response.data.locations.length === 0) {
            results.innerHTML = '<p class="text-amber-500">Keine Haltestellen für diese Adresse gefunden. Bitte versuchen Sie eine andere Adresse.</p>'
            return
        }
    } catch (error) {
        console.error('Error searching:', error)
        results.innerHTML = '<p class="text-red-500">Fehler bei der Suche</p>'
    }
}

/**
 * Debounced version of the search handler
 */
const debouncedSearch = debounce(handleSearch, 500)

/**
 * Handles the goto button click to generate a deep link and open it
 * @returns {void}
 */
const handleNavigation = () => {
    const date = document.getElementById('date').value
    const time = document.getElementById('time').value
    const fromAddress = document.getElementById('fromAddress').value

    // Get selected location from data attribute (if any element has aria-selected="true")
    const selectedLocationElement = document.querySelector('.location-item[aria-selected="true"]')

    const formData = {
        date,
        time,
        fromAddress,
        selectedLocation: selectedLocationElement ? true : false
    }

    const validation = validateNavigation(formData)

    if (!validation.isValid) {
        showValidationErrors(validation.errors)
        return
    }

    clearValidationErrors()

    const locationInfo = JSON.parse(selectedLocationElement.dataset.locationInfo)

    const formattedDate = formatDateForDeepLink(date)
    const formattedTime = time.replace(':', '')

    const deepLink = generateDeepLink(locationInfo.id, formattedDate, formattedTime, destinationId)

    console.log('Deep Link:', deepLink)

    window.open(deepLink, '_blank')
}

/**
 * Initializes the application
 * @returns {void}
 */
const initApp = () => {
    fetchInitialData()

    document.addEventListener('DOMContentLoaded', () => {
        const gotoButton = document.getElementById('gotoButton')
        const fromAddressInput = document.getElementById('fromAddress')

        fromAddressInput.addEventListener('input', debouncedSearch)

        gotoButton.addEventListener('click', handleNavigation)

        // Clear validation errors when typing
        const inputs = document.querySelectorAll('input')
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('input-error', 'border-red-500')
                const errorEl = input.parentNode.querySelector('.error-message')
                if (errorEl) errorEl.remove()
            })
        })
    })
}

initApp()