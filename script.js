// Move categoryLabels here
const categoryLabels = {
    categoryA: 'NYTTJANDE',
    categoryB: 'VÄLMÅENDE',
    categoryC: 'INKLUDERING',
    categoryD: 'BETEENDEFÖRÄNDRING',
    categoryE: 'BIODIVERSITET',
    categoryF: 'KLIMATAVTRYCK',
    categoryG: 'MARK',
    categoryH: 'ENERGI',
    categoryI: 'PENGAR',
    categoryJ: 'RESURSUTNYTTJANDE',
    categoryK: 'RESILIENS',
    categoryL: 'SKÖNHET',
    categoryM: 'FLEXIBILITET',
    categoryN: 'ÄGANDESKAP',
    categoryO: 'DEMONTERBARHET'
};


const pages = ['vision.html', 'project.html', 'step1.html', 'step2.html', 'step3.html', './summary.html']; // Ensure correct path to summary.html
let currentPage = 0;
let formData = {};
let isTransitioning = false; // Flag to track if a transition is in progress

// Make selectNumber globally accessible
function selectNumber(element, categoryId) {
    const numberOptions = element.parentElement.querySelectorAll('span');
    numberOptions.forEach(option => option.classList.remove('selected'));
    element.classList.add('selected');
    const input = document.getElementById(categoryId);
    if (input) {
        input.value = element.textContent;
        formData[categoryId] = element.textContent; // Update formData with the selected value
        
        // Also update the sessionStorage directly to ensure consistency
        sessionStorage.setItem(categoryId, element.textContent);
    }
    
    // Always update chart after value changes
    updateChart();
    saveInputs();
}

// Make selectNumber globally accessible
window.selectNumber = selectNumber;

// Function to limit textarea input to 8 rows
function limitTextareaRows() {
    const textareas = document.querySelectorAll('textarea');
    const MAX_ROWS = 8;
    const LINE_HEIGHT = 20; // Based on your CSS line-height setting
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const lines = this.value.split('\n');
            
            // Check if we've exceeded max rows
            if (lines.length > MAX_ROWS) {
                // Keep only the first 8 rows
                this.value = lines.slice(0, MAX_ROWS).join('\n');
            }
            
            // For lines that exceed the width and cause wrapping
            if (this.scrollHeight > (MAX_ROWS * LINE_HEIGHT) + 20) { // +20 for padding
                const currentText = this.value;
                
                // Gradually trim text until it fits within 8 rows
                while (this.scrollHeight > (MAX_ROWS * LINE_HEIGHT) + 20 && this.value.length > 0) {
                    this.value = this.value.slice(0, -1);
                }
            }
        });
        
        // Apply constraints immediately to any existing text
        textarea.dispatchEvent(new Event('input'));
    });
}

// preloadedHtml: sidans HTML om den redan finns (startsidan skickar med
// visionstexten), så sidan kan läggas in direkt utan att vänta på fetch
async function loadPage(index, direction = 'forward', preloadedHtml = null) {
  if (isTransitioning) return; // Prevent multiple transitions
  isTransitioning = true;

  const container = document.getElementById('form-container');
  const oldPage = container.firstElementChild;

  try {
    let html = preloadedHtml;
    if (!html) {
      const res = await fetch(pages[index]);
      if (!res.ok) throw new Error(`Failed to load ${pages[index]}`);
      html = await res.text();
    }

    const newDiv = document.createElement('div');
    newDiv.classList.add('form-page');
    newDiv.innerHTML = html;

    if (direction === 'none') {
      // Ingen animation - sidan visas direkt på plats (används när man kommer
      // från startsidan, där texten redan har glidit upp)
    } else if (direction === 'forward' && !oldPage) {
      // Första sidan: glid upp från skärmens nederkant
      newDiv.classList.add('intro-slide');
      container.classList.add('intro-active');
      newDiv.addEventListener('animationend', () => {
        newDiv.classList.remove('intro-slide');
        container.classList.remove('intro-active');
      }, { once: true });
    } else if (direction === 'forward') {
      container.classList.remove('intro-active'); // Om man bläddrar vidare mitt i introt
      newDiv.classList.add('slide-up-in');
      if (oldPage) {
        oldPage.classList.remove('active'); // Ensure old page is not active
        oldPage.classList.remove('slide-down-in', 'slide-up-in', 'intro-slide'); // Remove any lingering classes
        oldPage.classList.add('slide-up-out'); // Apply slide-up-out to current page
      }
    } else {
      newDiv.classList.add('slide-down-in');
      if (oldPage) {
        oldPage.classList.remove('active'); // Ensure old page is not active
        oldPage.classList.remove('slide-up-in', 'slide-down-in'); // Remove any lingering classes
        oldPage.classList.add('slide-down-out'); // Apply slide-down-out to current page
      }
    }

    // Första sidan (ingen gammal sida att glida undan) markeras aktiv direkt.
    // Annars ligger den osynlig en halv sekund: inaktiva sidor är absolut
    // positionerade och klipps bort av #form-container som då har höjden 0.
    if (!oldPage) newDiv.classList.add('active');

    container.appendChild(newDiv);

    setTimeout(() => {
      newDiv.classList.add('active'); // Mark the new page as active
      if (oldPage) container.removeChild(oldPage); // Remove old page after animation
      isTransitioning = false; // Reset the flag after transition

      // Dynamically adjust the height of the wrapper to fit the content
      const formWrapper = document.getElementById('form-wrapper');
      const formContainer = document.getElementById('form-container');
      formWrapper.style.height = formContainer.scrollHeight + 'px'; // Adjust height to fit content

      // Klick hanteras av onclick i HTML-filerna - här gör vi bara de
      // klickbara elementen nåbara med tangentbordet (Tab + Enter/Mellanslag)
      makeKeyboardAccessible(newDiv);

      // Restore saved inputs for the current page
      restoreInputs();
   
      // Reset progress for the current page and update the chart
      updateChart();
      updateSummaryChart();

      // Apply textarea row limiting after page is loaded
      limitTextareaRows();

    }, 500);

    // Update button visibility based on current page
    document.getElementById('exportBtn').style.display = (index === pages.length - 1) ? 'flex' : 'none';
    
    // Hide next button on last page and on the vision page (which has its own
    // "Testa ditt projekt" button), show it otherwise
    const nextButton = document.getElementById('navNextBtn');
    if (nextButton) {
      nextButton.style.display = (index === pages.length - 1 || index === 0) ? 'none' : 'inline-block';
    }

    // Hide prev button on first page, show it otherwise
    const prevButton = document.getElementById('navPrevBtn');
    if (prevButton) {
      prevButton.style.display = (index === 0) ? 'none' : 'inline-block';
    }
    
    currentPage = index;

  } catch (error) {
    console.error(error);
    alert(`Sidan kunde inte laddas: ${pages[index]}`);
    isTransitioning = false;
  }
}

function nextPage() {
  saveInputs();
  if (currentPage < pages.length - 1) loadPage(currentPage + 1, 'forward');
}

function prevPage() {
  saveInputs();
  if (currentPage > 0) loadPage(currentPage - 1, 'backward');
}

// Snabbnavigeringen (cirklarna i nederkant): hoppa direkt till en sida.
// Glider uppåt om sidan ligger längre fram, nedåt om den ligger bakåt.
function goToPage(index) {
  if (index === currentPage) return;
  saveInputs();
  loadPage(index, index > currentPage ? 'forward' : 'backward');
}
window.goToPage = goToPage;

function updateSummaryChart() {
    // Only create the chart if we're on the summary page
    if (currentPage !== pages.length - 1) {
        return; // Don't render summary chart if not on summary page
    }
    
    const chartDom = document.getElementById('roseChart');
    if (!chartDom) {
        console.error('Rose chart container not found.');
        return;
    }

    // Check if this chart already has an instance
    let myChart = echarts.getInstanceByDom(chartDom);
    
    // If no instance exists, initialize it
    if (!myChart) {
        myChart = echarts.init(chartDom);
    }
    
    myChart.clear();

    // Add support for action plan textarea
    const actionPlan = document.getElementById('actionPlan');
    if (actionPlan) {
        // Load saved data
        actionPlan.value = formData['actionPlan'] || sessionStorage.getItem('actionPlan') || '';
        
        // Set up event listener to save data
        actionPlan.addEventListener('input', function() {
            formData['actionPlan'] = this.value;
            sessionStorage.setItem('actionPlan', this.value);
            saveInputs();
        });
    }

    const categories = [
        { name: 'NYTTJANDE', value: parseFloat(formData['categoryA'] || sessionStorage.getItem('categoryA') || 0) },
        { name: 'VÄLMÅENDE', value: parseFloat(formData['categoryB'] || sessionStorage.getItem('categoryB') || 0) },
        { name: 'INKLUDERING', value: parseFloat(formData['categoryC'] || sessionStorage.getItem('categoryC') || 0) },
        { name: 'BETEENDEFÖRÄNDRING', value: parseFloat(formData['categoryD'] || sessionStorage.getItem('categoryD') || 0) },
        { name: 'BIODIVERSITET', value: parseFloat(formData['categoryE'] || sessionStorage.getItem('categoryE') || 0) },
        { name: 'KLIMATAVTRYCK', value: parseFloat(formData['categoryF'] || sessionStorage.getItem('categoryF') || 0) },
        { name: 'MARK', value: parseFloat(formData['categoryG'] || sessionStorage.getItem('categoryG') || 0) },
        { name: 'ENERGI', value: parseFloat(formData['categoryH'] || sessionStorage.getItem('categoryH') || 0) },
        { name: 'PENGAR', value: parseFloat(formData['categoryI'] || sessionStorage.getItem('categoryI') || 0) },
        { name: 'RESURSUTNYTTJANDE', value: parseFloat(formData['categoryJ'] || sessionStorage.getItem('categoryJ') || 0) },
        { name: 'RESILIENS', value: parseFloat(formData['categoryK'] || sessionStorage.getItem('categoryK') || 0) },
        { name: 'SKÖNHET', value: parseFloat(formData['categoryL'] || sessionStorage.getItem('categoryL') || 0) },
        { name: 'FLEXIBILITET', value: parseFloat(formData['categoryM'] || sessionStorage.getItem('categoryM') || 0) },
        { name: 'ÄGANDESKAP', value: parseFloat(formData['categoryN'] || sessionStorage.getItem('categoryN') || 0) },
        { name: 'DEMONTERBARHET', value: parseFloat(formData['categoryO'] || sessionStorage.getItem('categoryO') || 0) }
    ];

   // Sortera kategorierna alfabetiskt
   const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));

   // Clear existing list items before adding new ones
   const topCategoriesList = document.getElementById('topCategoriesList');
   const additionalCategoriesList = document.getElementById('additionalCategoriesList');
    
    if (topCategoriesList) {
        topCategoriesList.innerHTML = '';
    }
    if (additionalCategoriesList) {
        additionalCategoriesList.innerHTML = '';
    }

    // Endast inledande versal i punktlistorna (kategorinamnen är annars HELA VERSALER)
    const toSentenceCase = (str) => str.charAt(0) + str.slice(1).toLowerCase();

    // Hitta topp 3 kategorier baserat på högsta värde
    const topCategories = [...categories].sort((a, b) => b.value - a.value).slice(0, 3);
    topCategories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = `${toSentenceCase(category.name)}: ${category.value}`;
        topCategoriesList.appendChild(listItem);
    });

    // Hitta kategorierna rankade 4-6
    const additionalCategories = [...categories].sort((a, b) => b.value - a.value).slice(3, 6);
    additionalCategories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.textContent = `${toSentenceCase(category.name)}: ${category.value}`;
        additionalCategoriesList.appendChild(listItem);
    });


    // Skapa en serie för maxvärdet med olika färger
    const maxSeries = categories.map(category => {
        let color;
        if (['Category A', 'Category B', 'Category C', 'Category D', 'Category E'].includes(category.name)) {
            color = '#e5e4e4'; // Ljusgrå färg
        } else if (['Category F', 'Category G', 'Category H', 'Category I', 'Category J'].includes(category.name)) {
            color = '#e2e2e1'; // Mörkare grå färg
        } else {
            color = '#dddddd'; // Ännu mörkare grå färg
        }
        return {
            name: category.name,
            value: 5,
            itemStyle: {
                color: color,
                borderColor: '#fff', // Remove white border by setting it to the same color
                borderWidth: 1
            }
        };
    });
    // Huvudfärger för varje intervall
    const mainColors = ['#8d9e7c', '#e0b34e', '#e0867c'];

    // Funktion för att generera färger med olika opaciteter
    function getColorWithOpacity(color, opacity) {
        const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
        return color + opacityHex;
    }

    // Generera färger för Data-serien med olika opaciteter
    const dataColors = categories.map((category, index) => {
        let mainColor;
        let opacity;
        if (index < 5) {
            mainColor = mainColors[0];
            opacity = index * 0.2;
        } else if (index < 10) {
            mainColor = mainColors[1];
            opacity = (index - 5) * 0.2;
        } else {
            mainColor = mainColors[2];
            opacity = (index - 10) * 0.2;
        }
        return getColorWithOpacity(mainColor, 1 - opacity);
    });

    const option = {

        tooltip: {
            trigger: 'item',
            position: function (point, params, dom, rect, size) {
                // place tooltip centered above the mouse cursor with a fixed offset
                return [point[0] - rect.width / 2, point[1] - 50];
            },
            formatter: function (params) {
                // Visa endast tooltip för serien "Data"
                if (params.seriesName === 'Data') {
                    // Formatera texten så att första bokstaven är versal och resten gemener
                    const formattedName = params.name.charAt(0).toUpperCase() + params.name.slice(1).toLowerCase();
                    return `${formattedName}: ${params.value}`;
                }
                return ''; // Ingen tooltip för max value-serien
            },
            textStyle: {
                fontFamily: 'CircularStd-Bold', // Ändra till önskat typsnitt
                fontSize: 14, // Ändra till önskad storlek
                fontWeight: 'normal',
                color: '#000' // Ändra till önskad färg
            },
            backgroundColor: 'transparent', // Gör bakgrunden transparent
    borderColor: 'transparent', // Gör kantlinjen transparent
    shadowBlur: 0, // Ta bort skugga
    shadowColor: 'transparent', // Ta bort skugga
    shadowOffsetX: 0, // Ta bort skugga
    shadowOffsetY: 0 // Ta bort skugga
        },
        legend: {
            show: false
        },
        series: [
            {
                name: 'Max Value',
                type: 'pie',
                radius: ['5%', '80%'],
                roseType: 'area',
                avoidLabelOverlap: false,
                silent: true,
                itemStyle: {
                    borderRadius: 20,
                    borderColor: '#fff',
                    borderWidth: 1,
                    cursor: 'default'
                },
                label: {
                    show: false
                },
                emphasis: {
                    disabled: true,
                    itemStyle: {
                        cursor: 'default'
                    }
                },
                tooltip: {
                    show: false
                },
                data: maxSeries
            },
            {
                name: 'Data',
                type: 'pie',
                radius: ['5%', '80%'],
                roseType: 'area',
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 20,
                    borderColor: '#fff',
                    borderWidth: 1,
                    cursor: 'pointer'
                },
                label: {
                    show: false
                },
                emphasis: {
                    focus: 'series',
                    itemStyle: {
                        cursor: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iYmxhY2siIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2IDhDMTYgMTIuNDE4MyAxMi40MTgzIDggMTZDMy41ODE3IDE2IDAgMTIuNDE4MyAwIDhDMCAzLjU4MTcgMy41ODE3IDAgOCAwQzEyLjQxODMgMCAxNiAzLjU4MTcgMTYgOFoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+), auto' // Pekaren blir en svart fylld cirkel vid hover på Data-serien
                    }
                },
                data: categories.map((category, index) => ({
                    ...category,
                    itemStyle: {
                        color: dataColors[index % dataColors.length] // Använd olika färger för varje tårtbit
                    }
                }))
            }
        ]
    };

    myChart.setOption(option, true);

    // Ensure the chart resizes dynamically on window resize
    window.addEventListener('resize', () => {
        if (myChart && !myChart.isDisposed()) {
            myChart.resize();
        }
    });

    // Notify when the chart is fully rendered
    myChart.on('finished', function () {
        document.dispatchEvent(new Event('chartRendered')); // Dispatch custom event
    });

    // 🎯 Lägg till statiska etiketter runt diagrammet
    positionLabels(document.getElementById('labels-container'), categories);

    // Positionera etiketter vid start
    const labelsContainer = document.getElementById('labels-container');
    positionLabels(labelsContainer, categories);
    
    // Anropa funktionen igen när fönstret ändras för att behålla rätt positioner
    window.addEventListener('resize', () => {
        const labelsContainer = document.getElementById('labels-container');
        positionLabels(labelsContainer, categories);
        myChart.resize(); // Ensure the chart resizes dynamically
    });
}

// Define the positionLabels function
function positionLabels(labelsContainer, categories) {
    labelsContainer.innerHTML = ""; // Clear existing labels

    const radius = labelsContainer.clientWidth / 5.4; // Dynamically calculate radius
    const centerX = labelsContainer.clientWidth / 2;
    const centerY = labelsContainer.clientHeight / 2;

    categories.forEach((category, index) => {
        const angle = index * 24; // Each category takes up 24° (360° / 15)
        const adjustedAngle = angle +12; // Adjust to compensate for rotation

        const radians = (adjustedAngle - 90) * (Math.PI / 180); // -90 to start from the top

        const x = centerX + radius * Math.cos(radians);
        const y = centerY + radius * Math.sin(radians);

        const label = document.createElement('div');
        label.classList.add('category-label');
        label.textContent = category.name;

        // Position the text at the calculated coordinates
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;

        // Rotate the text to follow the circle
        let textRotation = adjustedAngle;

        // Flip the text if upside down
        if (textRotation > 90 && textRotation < 270) {
            textRotation += 180;
        }

        label.style.transform = `translate(-50%, -50%) rotate(${textRotation}deg)`;

        labelsContainer.appendChild(label);
    });
}

// Create a helper function for chart operations
function updateProgressChart(container = document, forceReset = false) {
    // Don't show progress chart on certain pages
    if (currentPage === 0 || currentPage === 1 || currentPage === pages.length - 1) {
        const existingChart = document.getElementById('doughnutChart');
        if (existingChart) {
            existingChart.style.display = 'none';
        }
        return;
    }
    
    // Show the chart if it was previously hidden
    const existingChart = document.getElementById('doughnutChart');
    if (existingChart) {
        existingChart.style.display = 'block';
    }

    let chartContainer = container.querySelector('#doughnutChart');
    if (!chartContainer) {
        console.warn('Chart container not found in the current context. Creating a new one.');
        chartContainer = document.createElement('div');
        chartContainer.id = 'doughnutChart';
        chartContainer.style.width = '100%';
        chartContainer.style.height = '400px';
        container.appendChild(chartContainer);
    }

    // Get existing chart instance or create new one
    let chart = echarts.getInstanceByDom(chartContainer);
    if (!chart) {
        chart = echarts.init(chartContainer);
    }

    const totalCategories = 15; // Total number of categories across all pages
    
    // Calculate filled categories and percentage
    let totalFilled = 0;
    
    if (!forceReset) {
        // Parse stored progress or initialize empty object
        const storedProgress = JSON.parse(sessionStorage.getItem('progress')) || { page1: 0, page2: 0, page3: 0 };

        // Recalculate progress for the current page based on selected values
        const currentPageKey = `page${currentPage + 1}`;
        const currentPageInputs = container.querySelectorAll('.number-options span.selected');
        storedProgress[currentPageKey] = currentPageInputs.length;

        // Save updated progress to sessionStorage
        sessionStorage.setItem('progress', JSON.stringify(storedProgress));

        // Calculate total filled categories across all pages
        totalFilled = Object.values(storedProgress).reduce((sum, value) => sum + value, 0);
    }

    const percentage = Math.round((totalFilled / totalCategories) * 100);

    const option = {
        series: [
            {
                name: 'Background',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: { show: false },
                labelLine: { show: false },
                data: [
                    { value: totalCategories, name: 'Background', itemStyle: { color: '#d3d3d3' } }
                ]
            },
            {
                name: 'Progress',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    position: 'center',
                    formatter: `${percentage}%`,
                    fontSize: 20,
                    fontWeight: 'bold'
                },
                labelLine: { show: false },
                data: [
                    { value: totalFilled, name: 'Filled', itemStyle: { color: '#000000', borderRadius: 20 } },
                    { value: totalCategories - totalFilled, name: 'Empty', itemStyle: { color: 'transparent' } }
                ]
            }
        ]
    };

    chart.setOption(option, true);
    
    // Make sure chart resizes with window
    window.addEventListener('resize', () => {
        if (chart && !chart.isDisposed()) {
            chart.resize();
        }
    });
    
    return chart;
}

// Update the updateChart function to use the helper
function updateChart(container = document) {
    return updateProgressChart(container, false);
}

function restoreInputs(container = document) {
  const savedFormData = JSON.parse(sessionStorage.getItem('formData')) || {};
  Object.assign(formData, savedFormData); // Merge saved data into formData

  // Ensure category values are properly loaded from both sources
  for (let i = 65; i <= 79; i++) { // ASCII codes for A-O
    const categoryKey = 'category' + String.fromCharCode(i);
    formData[categoryKey] = formData[categoryKey] || sessionStorage.getItem(categoryKey) || '0';
  }
  
  // Handle actionPlan specifically
  const actionPlan = container.querySelector('#actionPlan');
  if (actionPlan) {
    actionPlan.value = formData['actionPlan'] || sessionStorage.getItem('actionPlan') || '';
  }

  container.querySelectorAll('input, textarea').forEach(input => {
      if (formData[input.name]) {
          input.value = formData[input.name];
      }

      // Ensure the label's "for" attribute matches the input's "id"
      if (input.id) {
          const label = container.querySelector(`label[for="${input.id}"]`);
          if (label) {
              label.setAttribute('for', input.id);
          }
      }
  });

  container.querySelectorAll('.number-options').forEach(optionGroup => {
      const categoryId = optionGroup.id.replace('numberOptions', 'category');
      const savedValue = formData[categoryId];
      if (savedValue) {
          const matchingOption = Array.from(optionGroup.children).find(option => option.textContent === savedValue);
          if (matchingOption) {
              matchingOption.classList.add('selected');
          }
      }
  });
  
  // Update chart after restoring inputs
  updateChart();
}

function saveInputs() {
    document.querySelectorAll('#form-container input, #form-container textarea').forEach(input => {
        formData[input.name] = input.value;
    });

    document.querySelectorAll('#form-container .number-options').forEach(optionGroup => {
        const selected = optionGroup.querySelector('.selected');
        if (selected) {
            const categoryId = optionGroup.id.replace('numberOptions', 'category');
            formData[categoryId] = selected.textContent;
        }
    });

    sessionStorage.setItem('formData', JSON.stringify(formData)); // Save formData to sessionStorage
    
    // Always update the chart whenever inputs are saved
    updateChart();
}

// Update resetForm to use the helper
function resetForm() {
    if (confirm('Vill du verkligen börja om? Alla ifyllda svar försvinner.')) {
        // Clear the combined formData object
        sessionStorage.removeItem('formData');
        
        // Clear individual category items (A-O)
        for (let i = 65; i <= 79; i++) {
            const categoryKey = 'category' + String.fromCharCode(i);
            sessionStorage.removeItem(categoryKey);
        }
        
        // Clear progress data
        sessionStorage.removeItem('progress');
        
        // Clear project info fields
        const fieldIds = ['datum', 'projekt', 'affarsomrade', 'plats', 'skede', 
                          'bestallare', 'team', 'forfattare'];
        fieldIds.forEach(fieldId => {
            sessionStorage.removeItem(fieldId);
        });
        
        // Clear action plan
        sessionStorage.removeItem('actionPlan');
        
        // Reset the in-memory formData object
        formData = {};
        
        // Clear any existing chart and reset to 0%
        updateProgressChart(document, true);
        
        // Clear actionPlan textarea if it exists in the current page
        const actionPlanElement = document.getElementById('actionPlan');
        if (actionPlanElement) {
            actionPlanElement.value = '';
        }
        
        loadPage(0); // Reload the first page
    }
}

// Attach resetForm to the global window object
window.resetForm = resetForm;

// Make toggleText globally accessible (anropas via onclick i HTML-filerna)
function toggleText(button) {
    const column = button.closest('.column');
    column.classList.toggle('expanded');
}

window.toggleText = toggleText;

// Siffrorna 1-5, "läs mer"-pilen och "Se projektexempel" är span/div-element,
// inte riktiga knappar. Här gör vi dem fokuserbara och klickbara med tangentbordet.
const KEYBOARD_CLICKABLE = '.number-options span, .toggle-button, .example-link';

function makeKeyboardAccessible(container) {
    container.querySelectorAll(KEYBOARD_CLICKABLE).forEach(el => {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
    });
    container.querySelectorAll('.toggle-button').forEach(el => {
        el.setAttribute('aria-label', 'Visa mer text');
    });
}

document.getElementById('form-container').addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const el = event.target.closest(KEYBOARD_CLICKABLE);
    if (el) {
        event.preventDefault(); // Hindra att mellanslag scrollar sidan
        el.click();
    }
});

// Helper function to wait for a chart to finish rendering
function waitForChartRender(chartElement, timeout = 5000) {
    return new Promise((resolve, reject) => {
        if (!chartElement) {
            resolve(); // No chart to wait for
            return;
        }
        
        const chart = echarts.getInstanceByDom(chartElement);
        if (!chart) {
            resolve(); // No chart instance, nothing to wait for
            return;
        }
        
        // Check if the chart is already rendered (has canvas with content)
        const canvas = chartElement.querySelector('canvas');
        if (canvas && canvas.width > 0 && canvas.height > 0 && 
            // Additionally check if there's content drawn on the canvas
            canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some(channel => channel !== 0)) {
            // Chart already has rendered content
            resolve();
            return;
        }

        // Set a timeout for the maximum wait time
        const timeoutId = setTimeout(() => {
            document.removeEventListener('chartRendered', onChartRendered);
            console.warn('Chart render timeout - proceeding anyway');
            resolve(); // Resolve anyway to prevent blocking
        }, timeout);
        
        // Listen for the custom chartRendered event
        const onChartRendered = () => {
            clearTimeout(timeoutId);
            document.removeEventListener('chartRendered', onChartRendered);
            // Give a small extra time for any final rendering
            setTimeout(resolve, 100);
        };
        
        document.addEventListener('chartRendered', onChartRendered);
        
        // Force a chart update to ensure the finished event will fire
        chart.resize();
    });
}

// Make exportPDF globally accessible
async function exportPDF() {
    // Add this style block to fix textareas in PDF export
    const textareaFixStyle = document.createElement('style');
    textareaFixStyle.textContent = `
        #pdf-render-container textarea {
            min-height: 160px !important;
            height: auto !important;
            max-height: none !important;
            resize: none !important;
            overflow: visible !important;
            white-space: pre-wrap !important;
            line-height: 20px !important;
            background: linear-gradient(to bottom, #5f5f5f 0.1px, transparent 1px) repeat-y !important;
            background-size: 100% 20px !important;
            background-position: 0 5px !important;
            border: none !important;
            padding: 10px !important;
            font-family: 'CircularStd-Book', Arial, sans-serif !important;
            font-size: 0.9em !important;
            display: block !important;
            box-sizing: border-box !important;
        }
        
        .textarea-replacement {
            min-height: 160px !important;
            height: auto !important;
            max-height: none !important;
            padding: 10px !important;
            border: none !important;
            background: linear-gradient(to bottom, #5f5f5f 0.1px, transparent 1px) repeat-y !important;
            background-size: 100% 20px !important;
            background-position: 0 5px !important;
            margin-top: 10px !important;
            margin-bottom: 10px !important;
            font-family: 'CircularStd-Book', Arial, sans-serif !important;
            font-size: 0.9em !important;
            white-space: pre-wrap !important;
            line-height: 20px !important;
            box-sizing: border-box !important;
            display: block !important;
            width: calc(100% - 20px) !important;
        }
    `;
    document.head.appendChild(textareaFixStyle);

    // Backup the current form and progress data before PDF export
    const formDataBackup = JSON.parse(sessionStorage.getItem('formData')) || {};
    const progressBackup = JSON.parse(sessionStorage.getItem('progress')) || {};
    const categoryBackup = {};
    for (let i = 65; i <= 79; i++) {
        const categoryKey = 'category' + String.fromCharCode(i);
        categoryBackup[categoryKey] = sessionStorage.getItem(categoryKey);
    }
    // Backup action plan separately
    const actionPlanBackup = sessionStorage.getItem('actionPlan');

    // Create a style element to disable all animations and hide content during export
    const noAnimationsStyle = document.createElement('style');
    noAnimationsStyle.textContent = `
        * {
            transition: none !important;
            animation: none !important;
            animation-duration: 0s !important;
            transition-duration: 0s !important;
        }
        /* Hide all content during export */
        body > *:not(#loadingDiv):not(#pdf-render-container) {
            visibility: hidden !important;
        }
                /* Hide ART logo during PDF export */
    .art-logo {
        display: none !important;
    }
    `;
    document.head.appendChild(noAnimationsStyle);

    // Initialize jsPDF
    let jsPDF;
    if (window.jspdf.jsPDF) {
        jsPDF = window.jspdf.jsPDF;
    } else {
        ({ jsPDF } = window.jspdf);
    }

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const currentPageBackup = currentPage;

    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = 'Preparing PDF export...';
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.background = 'rgba(255,255,255,0.9)';
    loadingDiv.style.padding = '20px';
    loadingDiv.style.borderRadius = '5px';
    loadingDiv.style.zIndex = '9999';
    document.body.appendChild(loadingDiv);

    // Create a fixed-size rendering container
    const renderContainer = document.createElement('div');
    renderContainer.id = 'pdf-render-container';
    renderContainer.style.position = 'absolute';
    renderContainer.style.top = '-9999px';
    renderContainer.style.left = '-9999px';
    const multiplier = 0.9; // Define a multiplier variable
    renderContainer.style.width = `${2000 * multiplier}px`;
    renderContainer.style.height = `${1100 * multiplier}px`;
    renderContainer.style.overflow = 'hidden';
    renderContainer.style.backgroundColor = '#ebebeb';//canvas background color
    document.body.appendChild(renderContainer);

    try {
        // Inside the try block, add this function to modify textareas before rendering
        const fixTextareasForRendering = (container) => {
            container.querySelectorAll('textarea').forEach(textarea => {
                // Create a div to replace the textarea for rendering
                const replacementDiv = document.createElement('div');
                replacementDiv.className = 'textarea-replacement';
                
                // Get the text content, ensuring all lines are preserved
                let content = textarea.value || '';
                
                // Ensure exactly 8 lines (or fill with empty lines if needed)
                const lines = content.split('\n');
                while (lines.length < 8) {
                    lines.push(' '); // Add empty lines with a space to ensure they're visible
                }
                
                // Join the lines back with <br> tags
                content = lines.slice(0, 8).join('<br>');
                
                // Add the content to the replacement div
                replacementDiv.innerHTML = content;
                
                // Replace the textarea with our div
                if (textarea.parentNode) {
                    textarea.parentNode.replaceChild(replacementDiv, textarea);
                }
            });
        };

        // Use a modified array of pages for the PDF export.
        // Note: pdfPages[1..] correspond to pages[0..] in the live "pages" array
        // (pdfPages has one extra page - the cover - at the very front), so the
        // generic branch below calls loadPage(i - 1) to account for the offset.
        const pdfPages = ['cover_print.html', 'vision_print.html', 'project_info_print.html', 'step1.html', 'step2.html', 'step3.html', './summary.html'];

        for (let i = 0; i < pdfPages.length; i++) {
            loadingDiv.innerHTML = `Rendering page ${i + 1} of ${pdfPages.length}...`;

            // Försättsbladet
            if (i === 0) {
                try {
                    const res = await fetch(pdfPages[i]);
                    if (!res.ok) throw new Error(`Failed to load ${pdfPages[i]}`);
                    const html = await res.text();

                    renderContainer.innerHTML = html;

                    const projectName = sessionStorage.getItem('projekt') || formData['projekt'] || '';
                    const projectNameEl = renderContainer.querySelector('#coverProjectName');
                    if (projectNameEl) projectNameEl.textContent = projectName;

                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error(`Error preparing cover page for PDF:`, error);
                }
            } else if (i === 1) {
                // For the vision page, just load it and give extra time for rendering
                try {
                    const res = await fetch(pdfPages[i]);
                    if (!res.ok) throw new Error(`Failed to load ${pdfPages[i]}`);
                    const html = await res.text();

                    // Create a temporary element to hold the vision page content
                    renderContainer.innerHTML = html;

                    // Just give extra time for rendering
                    await new Promise(resolve => setTimeout(resolve, 1000));

                } catch (error) {
                    console.error(`Error preparing vision page for PDF:`, error);
                }
            } else if (i === 2) { // Project info page
                try {
                    const res = await fetch(pdfPages[i]);
                    if (!res.ok) throw new Error(`Failed to load ${pdfPages[i]}`);
                    const html = await res.text();

                    // Create a temporary element to hold the project info print content
                    renderContainer.innerHTML = html;

                    // Fill in values from sessionStorage for project info fields
                    const fieldIds = ['datum', 'projekt', 'affarsomrade', 'plats', 'skede',
                                     'bestallare', 'team', 'forfattare'];

                    fieldIds.forEach(fieldId => {
                        const value = sessionStorage.getItem(fieldId) || formData[fieldId] || '';
                        const input = renderContainer.querySelector(`#${fieldId}`);
                        if (input) input.value = value;

                        // For date field, also update the display element
                        if (fieldId === 'datum') {
                            const dateDisplay = renderContainer.querySelector('#datum-display');
                            if (dateDisplay) dateDisplay.textContent = value;
                        }
                    });

                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    console.error(`Error loading ${pdfPages[i]}:`, error);
                    // If loading fails, create a simple page with error message
                    renderContainer.innerHTML = '<div class="header"><h1>Project Information</h1></div><p>Error loading project information page.</p>';
                }
            } else {
                // For other pages, use the normal page loading mechanism.
                // pdfPages has one extra page (the cover) at the front compared
                // to the live "pages" array, so subtract 1 to get the right index.
                const oldTransitioning = isTransitioning;
                isTransitioning = false;
                await loadPage(i - 1);
                isTransitioning = oldTransitioning;

                if (i < pdfPages.length - 1) {
                    document.querySelectorAll('.toggle-button').forEach(button => {
                        button.style.display = 'none';
                    });

                    document.querySelectorAll('.column').forEach(column => {
                        column.classList.add('expanded');
                    });
                }

                if (i === pdfPages.length - 1) {
                    const roseChart = document.getElementById('roseChart');
                    if (roseChart) {
                        updateSummaryChart();
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                } else {
                    const doughnutChart = document.getElementById('doughnutChart');
                    if (doughnutChart) {
                        updateChart();
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }

                renderContainer.innerHTML = '';

                let contentToClone;
                if (i === pdfPages.length - 1) {
                    contentToClone = document.querySelector('.header');
                    if (contentToClone) {
                        renderContainer.appendChild(contentToClone.cloneNode(true));
                    }

                    const topCategories = document.querySelector('.top-categories');
                    if (topCategories) {
                        renderContainer.appendChild(topCategories.cloneNode(true));
                    }

                    const chartWrapper = document.createElement('div');
                    chartWrapper.style.position = 'absolute';
                    chartWrapper.style.width = '100%';
                    chartWrapper.style.height = '1000px'; // Fixed height for the chart
                    chartWrapper.style.top = '50%';
                    chartWrapper.style.left = '0';
                    chartWrapper.style.transform = 'translateY(-50%)';
                    renderContainer.appendChild(chartWrapper);

                    const pdfChartContainer = document.createElement('div');
                    pdfChartContainer.id = 'pdf-rose-chart';
                    pdfChartContainer.style.position = 'absolute';
                    pdfChartContainer.style.top = '0';
                    pdfChartContainer.style.left = '0';
                    pdfChartContainer.style.width = '100%';
                    pdfChartContainer.style.height = '100%';
                    chartWrapper.appendChild(pdfChartContainer);

                    // Add a container for labels with the same dimensions
                    const labelsContainer = document.createElement('div');
                    labelsContainer.id = 'pdf-labels-container';
                    labelsContainer.style.position = 'absolute';
                    labelsContainer.style.top = '0';
                    labelsContainer.style.left = '0';
                    labelsContainer.style.width = '100%';
                    labelsContainer.style.height = '100%';
                    labelsContainer.style.zIndex = '10';
                    chartWrapper.appendChild(labelsContainer);

                    const pdfChart = echarts.init(pdfChartContainer);

                    const categories = [
                        { name: 'NYTTJANDE', value: parseFloat(formData['categoryA'] || sessionStorage.getItem('categoryA') || 0) },
                        { name: 'VÄLMÅENDE', value: parseFloat(formData['categoryB'] || sessionStorage.getItem('categoryB') || 0) },
                        { name: 'INKLUDERING', value: parseFloat(formData['categoryC'] || sessionStorage.getItem('categoryC') || 0) },
                        { name: 'BETEENDEFÖRÄNDRING', value: parseFloat(formData['categoryD'] || sessionStorage.getItem('categoryD') || 0) },
                        { name: 'BIODIVERSITET', value: parseFloat(formData['categoryE'] || sessionStorage.getItem('categoryE') || 0) },
                        { name: 'KLIMATAVTRYCK', value: parseFloat(formData['categoryF'] || sessionStorage.getItem('categoryF') || 0) },
                        { name: 'MARK', value: parseFloat(formData['categoryG'] || sessionStorage.getItem('categoryG') || 0) },
                        { name: 'ENERGI', value: parseFloat(formData['categoryH'] || sessionStorage.getItem('categoryH') || 0) },
                        { name: 'PENGAR', value: parseFloat(formData['categoryI'] || sessionStorage.getItem('categoryI') || 0) },
                        { name: 'RESURSUTNYTTJANDE', value: parseFloat(formData['categoryJ'] || sessionStorage.getItem('categoryJ') || 0) },
                        { name: 'RESILIENS', value: parseFloat(formData['categoryK'] || sessionStorage.getItem('categoryK') || 0) },
                        { name: 'SKÖNHET', value: parseFloat(formData['categoryL'] || sessionStorage.getItem('categoryL') || 0) },
                        { name: 'FLEXIBILITET', value: parseFloat(formData['categoryM'] || sessionStorage.getItem('categoryM') || 0) },
                        { name: 'ÄGANDESKAP', value: parseFloat(formData['categoryN'] || sessionStorage.getItem('categoryN') || 0) },
                        { name: 'DEMONTERBARHET', value: parseFloat(formData['categoryO'] || sessionStorage.getItem('categoryO') || 0) }
                    ];

                    const mainColors = ['#8d9e7c', '#e0b34e', '#e0867c'];

                    function getColorWithOpacity(color, opacity) {
                        const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
                        return color + opacityHex;
                    }

                    const dataColors = categories.map((category, index) => {
                        let mainColor;
                        let opacity;
                        if (index < 5) {
                            mainColor = mainColors[0];
                            opacity = index * 0.2;
                        } else if (index < 10) {
                            mainColor = mainColors[1];
                            opacity = (index - 5) * 0.2;
                        } else {
                            mainColor = mainColors[2];
                            opacity = (index - 10) * 0.2;
                        }
                        return getColorWithOpacity(mainColor, 1 - opacity);
                    });

                    const maxSeries = categories.map(() => {
                        return {
                            name: 'Max Value',
                            value: 5,
                            itemStyle: {
                                color: '#e5e4e4',
                                borderColor: '#fff',
                                borderWidth: 1
                            }
                        };
                    });

                    const option = {

                        tooltip: { show: false },
                        legend: { show: false },
                        series: [
                            {
                                name: 'Max Value',
                                type: 'pie',
                                radius: ['5%', '80%'],
                                center: ['60%', '50%'],
                                roseType: 'area',
                                avoidLabelOverlap: false,
                                silent: true,
                                itemStyle: {
                                    borderRadius: 20,
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                },
                                label: { show: false },
                                emphasis: { disabled: true },
                                data: maxSeries
                            },
                            {
                                name: 'Data',
                                type: 'pie',
                                radius: ['5%', '80%'],
                                center: ['60%', '50%'],
                                roseType: 'area',
                                avoidLabelOverlap: false,
                                itemStyle: {
                                    borderRadius: 20,
                                    borderColor: '#fff',
                                    borderWidth: 1,
                                },
                                label: { show: false },
                                emphasis: { disabled: true },
                                data: categories.map((category, index) => ({
                                    ...category,
                                    itemStyle: {
                                        color: dataColors[index % dataColors.length]
                                    }
                                }))
                            }
                        ]
                    };

                    pdfChart.setOption(option);
                    
                    // Position labels around the chart with the same origin
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Place labels around the chart using the same center origin
                    positionChartLabels(labelsContainer, categories);
                    
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else if (i > 0) {
                    const header = document.querySelector('.header');
                    if (header) {
                        renderContainer.appendChild(header.cloneNode(true));
                    }

                    const container = document.querySelector('.container');
                    if (container) {
                        const containerClone = container.cloneNode(true);
                        containerClone.querySelectorAll('button, [onclick], .toggle-button').forEach(el => {
                            if (el.classList.contains('toggle-button')) {
                                el.style.cursor = 'default';
                                el.removeAttribute('onclick');
                            } else if (el.closest('.number-options')) {
                                el.removeAttribute('onclick');
                                el.style.cursor = 'default';
                            } else {
                                el.parentNode.removeChild(el);
                            }
                        });
                        renderContainer.appendChild(containerClone);

                        // Jämna ut höjden på introtexterna så 1-5-skalan och Kommentarer
                        // hamnar i linje mellan kolumnerna, oavsett hur lång varje
                        // kategoris text råkar vara (annars hoppar raderna mellan kolumner)
                        const columnParagraphs = containerClone.querySelectorAll('.column > p');
                        let maxParagraphHeight = 0;
                        columnParagraphs.forEach(p => {
                            maxParagraphHeight = Math.max(maxParagraphHeight, p.offsetHeight);
                        });
                        columnParagraphs.forEach(p => {
                            p.style.minHeight = `${maxParagraphHeight}px`;
                        });
                    }

                    if (i >= 3 && i <= 5) { // step1, step2, step3 i den nya pdfPages-ordningen
                        const doughnutChart = document.getElementById('doughnutChart');
                        if (doughnutChart) {
                            updateChart();
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }
                }
            }

            // Before rendering, add this line after populating renderContainer
            if (i > 0) {
                fixTextareasForRendering(renderContainer);
            }

            const canvas = await html2canvas(renderContainer, {
                scale: 2.0,
                useCORS: true,
                logging: false,
                allowTaint: true,
                imageTimeout: 0
            });

            if (i > 0) {
                doc.addPage();
            }

            doc.setFillColor(235, 235, 235);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            try {
                const imgData = canvas.toDataURL('image/jpeg', 2);
                const padding = 10;
                const availableWidth = pageWidth - (2 * padding);
                const availableHeight = pageHeight - (2 * padding);

                const imgProps = doc.getImageProperties(imgData);

                const calculateDimensions = (imgProps, availableWidth, availableHeight) => {
                    const imgRatio = imgProps.width / imgProps.height;
                    const pageRatio = availableWidth / availableHeight;

                    let finalWidth, finalHeight;

                    if (imgRatio > pageRatio) {
                        finalWidth = availableWidth;
                        finalHeight = finalWidth / imgRatio;
                    } else {
                        finalHeight = availableHeight;
                        finalWidth = finalHeight * imgRatio;
                    }

                    const xOffset = padding + (availableWidth - finalWidth) / 2;
                    const yOffset = padding + (availableHeight - finalHeight) / 2;

                    return { width: finalWidth, height: finalHeight, x: xOffset, y: yOffset };
                };

                const dims = calculateDimensions(imgProps, availableWidth, availableHeight);

                doc.addImage(
                    imgData,
                    'JPEG',
                    dims.x,
                    dims.y,
                    dims.width,
                    dims.height,
                    undefined,
                    'FAST'
                );
            } catch (imgError) {
                console.error('Error adding image to PDF:', imgError);
                doc.setFontSize(12);
                doc.text(`Error capturing page ${i + 1}. Please try again.`, 10, 10);
            }
        }

        loadingDiv.innerHTML = 'Generating final PDF...';
        doc.save('ART-Resultat.pdf');

        loadingDiv.innerHTML = 'PDF successfully created!';
        setTimeout(() => {
            if (document.body.contains(loadingDiv)) {
                document.body.removeChild(loadingDiv);
            }
        }, 2000);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('PDF:en kunde inte skapas: ' + error.message);
    } finally {
        sessionStorage.setItem('formData', JSON.stringify(formDataBackup));
        sessionStorage.setItem('progress', JSON.stringify(progressBackup));
        for (let i = 65; i <= 79; i++) {
            const categoryKey = 'category' + String.fromCharCode(i);
            if (categoryBackup[categoryKey] !== null) {
                sessionStorage.setItem(categoryKey, categoryBackup[categoryKey]);
            }
        }
        if (actionPlanBackup !== null) {
            sessionStorage.setItem('actionPlan', actionPlanBackup);
        }
        formData = {...formDataBackup};

        if (document.body.contains(renderContainer)) {
            document.body.removeChild(renderContainer);
        }

        if (document.head.contains(noAnimationsStyle)) {
            document.head.removeChild(noAnimationsStyle);
        }

        if (document.head.contains(textareaFixStyle)) {
            document.head.removeChild(textareaFixStyle);
        }

        setTimeout(() => {
            if (document.body.contains(loadingDiv)) {
                document.body.removeChild(loadingDiv);
            }
        }, 1000);

        if (currentPage !== currentPageBackup) {
            loadPage(currentPageBackup);
            setTimeout(() => {
                updateChart();
            }, 500);
        }
    }
}

function positionChartLabels(container, categories) {
    container.innerHTML = "";
    
    // Get the container dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width * 0.6; // Matchar center: ['60%', '50%'] på PDF-rosdiagrammet
    const centerY = height / 2;

    // Calculate radius based on the smaller dimension to ensure it fits
    const radius = Math.min(width, height) * 0.42; // 84% of half the smaller dimension

    categories.forEach((category, index) => {
        const angle = index * 24; // Each category takes up 24 degrees (360/15)
        const adjustedAngle = angle + 12; // Offset by 12 degrees to center categories
        
        // Convert angle to radians, starting from the top (-90 degrees)
        const radians = (adjustedAngle - 90) * (Math.PI / 180);
        
        // Calculate position using polar coordinates
        const x = centerX + radius * Math.cos(radians);
        const y = centerY + radius * Math.sin(radians);
        
        // Create the label element
        const label = document.createElement('div');
        label.classList.add('category-label');
        label.textContent = category.name;
        
        // Position label
        label.style.position = 'absolute';
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        
        // Calculate text rotation to maintain readability
        let textRotation = adjustedAngle;
        
        // Flip text that would appear upside down
        if (textRotation > 90 && textRotation < 270) {
            textRotation += 180;
        }
        
        // Apply rotation and centering
        label.style.transform = `translate(-50%, -50%) rotate(${textRotation}deg)`;
        
        // Style for PDF export
        label.style.fontFamily = 'Arial, sans-serif';
        label.style.fontSize = '14px';
        label.style.fontWeight = 'bold';
        label.style.color = '#000';
        label.style.whiteSpace = 'nowrap';
        label.style.textAlign = 'center';
        
        container.appendChild(label);
    });
}

// Svaren ligger i sessionStorage: de finns kvar om man laddar om sidan,
// men töms när fliken stängs. Startsidan (index.html) tömmer dem också,
// så den som börjar från början alltid får ett tomt formulär.
//
// Första sidan laddas direkt (det här är en module-script som körs när HTML:en
// är färdigläst) istället för på window.onload, som väntar på att alla
// typsnitt, ikoner och bilder ska bli klara först.
//
// Kommer man från startsidan har visionstexten redan glidit upp på plats
// där, så då visas den direkt utan egen animation.
const cameFromSplash = sessionStorage.getItem('fromSplash') === '1';
const splashVisionHtml = cameFromSplash ? sessionStorage.getItem('visionHtml') : null;
sessionStorage.removeItem('fromSplash');
sessionStorage.removeItem('visionHtml');
loadPage(0, cameFromSplash ? 'none' : 'forward', splashVisionHtml); // Load the first page
limitTextareaRows(); // Apply textarea row limiting on initial load

// Attach functions to the global window object to ensure they are accessible from the HTML
window.nextPage = nextPage;
window.prevPage = prevPage;
window.resetForm = resetForm;
window.exportPDF = exportPDF;

// ----------------------------------------------------------------------------
// Projektexempel-rutan ("Se projektexempel"). Rubrik/text finns i
// project-examples.js (window.projectExamples / window.categoryFileNames),
// som laddas in innan den här filen körs.
//
// Bilden/filmen letas upp automatiskt i mappen projektexempel/ utifrån
// kategorinamnet + exempelnumret, t.ex. "projektexempel/Nyttjande-1".
// Vi provar bildändelser först, sedan filmändelser, och visar en grå
// platshållare om inget hittas - så det går lika bra att lägga in filerna
// allt eftersom som att ha alla på plats direkt.
// ----------------------------------------------------------------------------
const EXAMPLE_MEDIA_FOLDER = 'projektexempel/';
const EXAMPLE_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
const EXAMPLE_VIDEO_EXTENSIONS = ['mp4', 'mov'];
const EXAMPLE_PLACEHOLDER_MEDIA = 'Symbols/placeholder-projekt.svg';
const exampleMediaCache = {};

let currentExampleCategory = null;
let currentExampleIndex = 0;

function openProjectExamples(categoryId) {
    const examples = window.projectExamples && window.projectExamples[categoryId];
    if (!examples || !examples.length) {
        console.warn(`Inga projektexempel hittades för ${categoryId}`);
        return;
    }
    currentExampleCategory = categoryId;
    currentExampleIndex = 0;
    renderProjectExample();
    document.getElementById('exampleModal').hidden = false;
    // Ladda de andra exemplen i bakgrunden så bläddringen går direkt
    preloadProjectExamples(categoryId);
}
window.openProjectExamples = openProjectExamples;

function closeProjectExamples() {
    document.getElementById('exampleModal').hidden = true;
    const videoEl = document.getElementById('exampleVideo');
    videoEl.pause();
    currentExampleCategory = null;
}
window.closeProjectExamples = closeProjectExamples;

function nextProjectExample() {
    const examples = window.projectExamples[currentExampleCategory];
    currentExampleIndex = (currentExampleIndex + 1) % examples.length;
    renderProjectExample();
}
window.nextProjectExample = nextProjectExample;

function prevProjectExample() {
    const examples = window.projectExamples[currentExampleCategory];
    currentExampleIndex = (currentExampleIndex - 1 + examples.length) % examples.length;
    renderProjectExample();
}
window.prevProjectExample = prevProjectExample;

function renderProjectExample() {
    const categoryId = currentExampleCategory;
    const index = currentExampleIndex;
    const examples = window.projectExamples[categoryId];
    const example = examples[index];

    document.getElementById('exampleTitle').textContent = example.title;
    document.getElementById('exampleProject').textContent = example.project;
    document.getElementById('exampleText').textContent = example.text;
    document.getElementById('exampleCounter').textContent = `${index + 1} / ${examples.length}`;

    const imageEl = document.getElementById('exampleImage');
    const videoEl = document.getElementById('exampleVideo');
    imageEl.alt = example.title;

    const isStillCurrent = () => currentExampleCategory === categoryId && currentExampleIndex === index;

    // Är filen inte laddad än göms bilden tills den är klar, istället för att
    // platshållaren fladdrar förbi. Platshållaren visas bara om filen saknas.
    if (!exampleMediaCache[`${categoryId}-${index}`]) {
        imageEl.classList.add('is-loading');
        videoEl.classList.add('is-loading');
    }

    resolveExampleMedia(categoryId, index, (media) => {
        // Hoppa över om användaren redan bläddrat vidare medan vi letade
        if (!isStillCurrent()) return;

        if (media.type === 'video') {
            imageEl.style.display = 'none';
            videoEl.src = media.url;
            videoEl.style.display = 'block';
            videoEl.play().catch(() => {});
            const reveal = () => { if (isStillCurrent()) videoEl.classList.remove('is-loading'); };
            if (videoEl.readyState >= 2) reveal();
            else videoEl.addEventListener('loadeddata', reveal, { once: true });
        } else {
            videoEl.pause();
            videoEl.removeAttribute('src');
            videoEl.style.display = 'none';
            imageEl.src = media.url;
            imageEl.style.display = 'block';
            // Vänta tills bilden är avkodad så den visas hel på en gång
            imageEl.decode().catch(() => {}).then(() => {
                if (isStillCurrent()) imageEl.classList.remove('is-loading');
            });
        }
    });
}

// Förladda alla exempel för en kategori (anropas när rutan öppnas och när
// man för musen över "Se projektexempel")
function preloadProjectExamples(categoryId) {
    const examples = window.projectExamples && window.projectExamples[categoryId];
    if (!examples) return;
    examples.forEach((_, i) => resolveExampleMedia(categoryId, i, () => {}));
}

// Pågående sökningar, så samma fil inte letas efter flera gånger samtidigt
const exampleMediaPending = {};

function resolveExampleMedia(categoryId, index, callback) {
    const cacheKey = `${categoryId}-${index}`;
    if (exampleMediaCache[cacheKey]) {
        callback(exampleMediaCache[cacheKey]);
        return;
    }
    if (exampleMediaPending[cacheKey]) {
        exampleMediaPending[cacheKey].push(callback);
        return;
    }
    exampleMediaPending[cacheKey] = [callback];

    const done = (result) => {
        exampleMediaCache[cacheKey] = result;
        const callbacks = exampleMediaPending[cacheKey];
        delete exampleMediaPending[cacheKey];
        callbacks.forEach(cb => cb(result));
    };

    const baseName = window.categoryFileNames[categoryId];
    const basePath = `${EXAMPLE_MEDIA_FOLDER}${baseName}-${index + 1}`;

    probeExtensions(basePath, EXAMPLE_IMAGE_EXTENSIONS, 'image', (imageUrl) => {
        if (imageUrl) return done({ type: 'image', url: imageUrl });
        probeExtensions(basePath, EXAMPLE_VIDEO_EXTENSIONS, 'video', (videoUrl) => {
            done(videoUrl
                ? { type: 'video', url: videoUrl }
                : { type: 'image', url: EXAMPLE_PLACEHOLDER_MEDIA });
        });
    });
}

// Börja ladda bilderna redan när musen (eller tangentbordsfokus) hamnar på
// "Se projektexempel" - då är de oftast klara när man klickar
['pointerover', 'focusin'].forEach(eventName => {
    document.addEventListener(eventName, (event) => {
        const link = event.target.closest && event.target.closest('.example-link');
        if (!link) return;
        const match = (link.getAttribute('onclick') || '').match(/'(category[A-O])'/);
        if (match) preloadProjectExamples(match[1]);
    });
});

function probeExtensions(basePath, extensions, kind, callback, i = 0) {
    if (i >= extensions.length) return callback(null);
    const url = `${basePath}.${extensions[i]}`;

    if (kind === 'image') {
        const probe = new Image();
        probe.onload = () => callback(url);
        probe.onerror = () => probeExtensions(basePath, extensions, kind, callback, i + 1);
        probe.src = url;
    } else {
        const probe = document.createElement('video');
        probe.onloadeddata = () => callback(url);
        probe.onerror = () => probeExtensions(basePath, extensions, kind, callback, i + 1);
        probe.src = url;
    }
}

// Stäng rutan med Escape-tangenten
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && currentExampleCategory !== null) {
        closeProjectExamples();
    }
});

// Varna innan fliken stängs eller man lämnar sidan (webbläsaren visar sin
// egen standardtext - den egna texten nedan används bara av äldre webbläsare)
window.addEventListener('beforeunload', (event) => {
    event.preventDefault();
    event.returnValue = 'Vill du lämna sidan? Svaren sparas inte om du stänger fliken.';
});
