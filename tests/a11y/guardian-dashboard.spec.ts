import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const guardianQuickActionsMarkup = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Guardian Quick Actions Preview</title>
    <style>
      body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f7fafc;
        margin: 0;
        padding: 2rem;
      }
      .grid {
        display: grid;
        gap: 1rem;
      }
      @media (min-width: 640px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (min-width: 1024px) {
        .grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
      button.quick-action {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        min-height: 48px;
        border-radius: 0.75rem;
        border: 1px solid #cbd5f5;
        background: white;
        font-size: 1rem;
        cursor: pointer;
      }
      button.quick-action:focus {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }
      #quick-action-modal[hidden] {
        display: none;
      }
      #quick-action-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }
      #quick-action-modal dialog {
        width: 100%;
        max-width: 480px;
        border: none;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      }
      #quick-action-modal dialog:focus {
        outline: none;
      }
      .modal-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
      }
      .modal-actions button {
        min-height: 44px;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
      }
      .primary {
        background: #2563eb;
        color: white;
      }
      .secondary {
        background: white;
        color: #1f2937;
        border: 1px solid #cbd5f5;
      }
      label {
        font-weight: 600;
        margin-bottom: 0.25rem;
        display: block;
      }
      input {
        width: 100%;
        border: 1px solid #cbd5f5;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-size: 1rem;
      }
      input:focus {
        outline: 3px solid #2563eb;
        outline-offset: 1px;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <section aria-label="Guardian quick actions" class="grid">
        <button class="quick-action" data-open-modal>
          <span aria-hidden="true">👨‍👩‍👧‍👦</span>
          Add Patient
        </button>
        <button class="quick-action">📋 Create Job</button>
        <button class="quick-action">📦 Browse Packages</button>
      </section>

      <div id="quick-action-modal" hidden>
        <dialog role="dialog" aria-modal="true" aria-label="Add Patient" id="modal-dialog">
          <h2>Add Patient</h2>
          <form>
            <label for="patientName">Patient Name</label>
            <input id="patientName" name="patientName" />
            <div class="modal-actions">
              <button type="submit" class="primary">Save</button>
              <button type="button" class="secondary" data-close-modal>
                Cancel
              </button>
            </div>
          </form>
          <button type="button" class="secondary" data-close-modal aria-label="Close modal">
            Close
          </button>
        </dialog>
      </div>
    </div>
    <script>
      (() => {
        const trigger = document.querySelector('[data-open-modal]');
        const modalLayer = document.getElementById('quick-action-modal');
        const dialog = document.getElementById('modal-dialog');
        const closeButtons = dialog.querySelectorAll('[data-close-modal]');

        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        const trapFocus = (event) => {
          if (event.key !== 'Tab' || modalLayer.hasAttribute('hidden')) {
            return;
          }

          const focusable = dialog.querySelectorAll(focusableSelectors);
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (event.shiftKey && document.activeElement === first) {
            last.focus();
            event.preventDefault();
          } else if (!event.shiftKey && document.activeElement === last) {
            first.focus();
            event.preventDefault();
          }
        };

        const openModal = () => {
          modalLayer.removeAttribute('hidden');
          dialog.showModal();
          dialog.querySelector('input').focus();
          document.addEventListener('keydown', trapFocus);
        };

        const closeModal = () => {
          if (modalLayer.hasAttribute('hidden')) return;
          dialog.close();
          modalLayer.setAttribute('hidden', '');
          document.removeEventListener('keydown', trapFocus);
          trigger.focus();
        };

        trigger.addEventListener('click', openModal);
        closeButtons.forEach((btn) => btn.addEventListener('click', closeModal));
        window.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            closeModal();
          }
        });
      })();
    </script>
  </body>
</html>`;

const guardianDisputeTableMarkup = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Guardian Dispute Table Preview</title>
    <style>
      body {
        margin: 0;
        padding: 2rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f1f5f9;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        background: white;
        border-radius: 0.75rem;
        overflow: hidden;
      }
      th,
      td {
        padding: 0.75rem 1rem;
        text-align: left;
      }
      th {
        background: #f8fafc;
        font-size: 0.85rem;
        letter-spacing: 0.05em;
      }
      tr + tr {
        border-top: 1px solid #e2e8f0;
      }
      button.sort {
        background: none;
        border: none;
        font: inherit;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        cursor: pointer;
      }
      button.sort:focus {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        font-size: 0.75rem;
        background: #e0f2fe;
        color: #0c4a6e;
      }
    </style>
  </head>
  <body>
    <div id="table-root">
      <table aria-label="Dispute summary table">
        <thead>
          <tr>
            <th scope="col">
              <button class="sort" data-sort="case">
                Case ID
                <span aria-hidden="true">↕</span>
              </button>
            </th>
            <th scope="col">
              <button class="sort" data-sort="claimant">
                Claimant
                <span aria-hidden="true">↕</span>
              </button>
            </th>
            <th scope="col">
              <button class="sort" data-sort="amount">
                Amount (BDT)
                <span aria-hidden="true">↕</span>
              </button>
            </th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DSP-1002</td>
            <td>Akter Hossain</td>
            <td data-amount="3200">3,200</td>
            <td><span class="badge">REVIEW</span></td>
          </tr>
          <tr>
            <td>DSP-1001</td>
            <td>Rahim Uddin</td>
            <td data-amount="5000">5,000</td>
            <td><span class="badge">OPEN</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <script>
      (() => {
        const rows = Array.from(document.querySelectorAll('tbody tr'));
        const updateRows = (sorted) => {
          const tbody = document.querySelector('tbody');
          tbody.innerHTML = '';
          sorted.forEach((row) => tbody.appendChild(row));
        };

        const sortHandlers = {
          case: (direction) =>
            [...rows].sort((a, b) =>
              direction === 'asc'
                ? a.cells[0].textContent.localeCompare(b.cells[0].textContent)
                : b.cells[0].textContent.localeCompare(a.cells[0].textContent)
            ),
          claimant: (direction) =>
            [...rows].sort((a, b) =>
              direction === 'asc'
                ? a.cells[1].textContent.localeCompare(b.cells[1].textContent)
                : b.cells[1].textContent.localeCompare(a.cells[1].textContent)
            ),
          amount: (direction) =>
            [...rows].sort((a, b) =>
              direction === 'asc'
                ? Number(a.cells[2].dataset.amount) - Number(b.cells[2].dataset.amount)
                : Number(b.cells[2].dataset.amount) - Number(a.cells[2].dataset.amount)
            ),
        };

        document.querySelectorAll('button.sort').forEach((button) => {
          let direction = 'asc';
          button.setAttribute('aria-pressed', 'false');

          button.addEventListener('click', () => {
            direction = direction === 'asc' ? 'desc' : 'asc';
            button.setAttribute('aria-pressed', direction === 'desc');
            const sorter = sortHandlers[button.dataset.sort];
            updateRows(sorter(direction));
          });
        });
      })();
    </script>
  </body>
</html>`;

const guardianPaymentHistoryMarkup = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Guardian Payment History Preview</title>
    <style>
      body {
        margin: 0;
        padding: 2rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f8fafc;
      }
      .panel-container {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
        max-width: 960px;
        margin: 0 auto;
      }
      h2 {
        margin-top: 0;
        font-size: 1.5rem;
      }
      .tablist {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      [role="tab"] {
        border-radius: 999px;
        border: 1px solid #cbd5f5;
        padding: 0.35rem 1rem;
        background: #fff;
        cursor: pointer;
      }
      [role="tab"][aria-selected="true"] {
        background: #1d4ed8;
        color: #fff;
        border-color: #1d4ed8;
      }
      [role="tab"]:focus {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }
      [role="tabpanel"] {
        margin-top: 1.25rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        text-align: left;
        padding: 0.75rem 0.5rem;
      }
      th {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #475569;
      }
      tr + tr {
        border-top: 1px solid #e2e8f0;
      }
      .status-pill {
        display: inline-flex;
        align-items: center;
        padding: 0.15rem 0.6rem;
        border-radius: 999px;
        font-size: 0.8rem;
        gap: 0.25rem;
      }
      .status-pill[data-status="scheduled"] {
        background: #ecfccb;
        color: #365314;
      }
      .status-pill[data-status="paid"] {
        background: #dcfce7;
        color: #166534;
      }
    </style>
  </head>
  <body>
    <section id="payments-root" aria-label="Guardian payment history">
      <div class="panel-container">
        <header>
          <h2>Payment Activity</h2>
          <p id="last-updated">Last updated: 27 Nov 2025, 09:00 GMT+6</p>
        </header>
        <div role="tablist" aria-label="Payment filters" class="tablist">
          <button role="tab" aria-selected="true" aria-controls="panel-all" id="tab-all">All transactions</button>
          <button role="tab" aria-selected="false" aria-controls="panel-upcoming" id="tab-upcoming" tabindex="-1">Upcoming payouts</button>
          <button role="tab" aria-selected="false" aria-controls="panel-completed" id="tab-completed" tabindex="-1">Completed payouts</button>
        </div>

        <div role="tabpanel" id="panel-all" aria-labelledby="tab-all">
          <table aria-label="All transactions table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Patient</th>
                <th scope="col">Amount (BDT)</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>27 Nov</td>
                <td>Rahim Uddin</td>
                <td data-amount="8500">8,500</td>
                <td><span class="status-pill" data-status="paid">Paid</span></td>
              </tr>
              <tr>
                <td>29 Nov</td>
                <td>Nasima Akter</td>
                <td data-amount="5200">5,200</td>
                <td><span class="status-pill" data-status="scheduled">Scheduled</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div role="tabpanel" id="panel-upcoming" aria-labelledby="tab-upcoming" hidden>
          <table aria-label="Upcoming payouts table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Patient</th>
                <th scope="col">Amount (BDT)</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr data-testid="upcoming-row">
                <td>29 Nov</td>
                <td>Nasima Akter</td>
                <td data-amount="5200">5,200</td>
                <td><span class="status-pill" data-status="scheduled">Scheduled</span></td>
              </tr>
              <tr data-testid="upcoming-row">
                <td>03 Dec</td>
                <td>Shahidul Islam</td>
                <td data-amount="6400">6,400</td>
                <td><span class="status-pill" data-status="scheduled">Scheduled</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div role="tabpanel" id="panel-completed" aria-labelledby="tab-completed" hidden>
          <table aria-label="Completed payouts table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Patient</th>
                <th scope="col">Amount (BDT)</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>24 Nov</td>
                <td>Rahim Uddin</td>
                <td data-amount="8500">8,500</td>
                <td><span class="status-pill" data-status="paid">Paid</span></td>
              </tr>
              <tr>
                <td>22 Nov</td>
                <td>Lamia Khatun</td>
                <td data-amount="4800">4,800</td>
                <td><span class="status-pill" data-status="paid">Paid</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <script>
      (() => {
        const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
        const activateTab = (tab) => {
          tabs.forEach((candidate) => {
            const panelId = candidate.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);
            const isActive = candidate === tab;
            candidate.setAttribute('aria-selected', String(isActive));
            if (isActive) {
              candidate.removeAttribute('tabindex');
              panel.removeAttribute('hidden');
            } else {
              candidate.setAttribute('tabindex', '-1');
              panel.setAttribute('hidden', '');
            }
          });
        };

        tabs.forEach((tab, index) => {
          tab.addEventListener('click', () => activateTab(tab));
          tab.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              const next = tabs[(index + 1) % tabs.length];
              next.focus();
            } else if (event.key === 'ArrowLeft') {
              event.preventDefault();
              const prev = tabs[(index - 1 + tabs.length) % tabs.length];
              prev.focus();
            } else if (event.key === 'Home') {
              event.preventDefault();
              tabs[0].focus();
            } else if (event.key === 'End') {
              event.preventDefault();
              tabs[tabs.length - 1].focus();
            } else if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              activateTab(tab);
            }
          });
        });
      })();
    </script>
  </body>
</html>`;

const guardianNotificationsMarkup = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Guardian Notifications Preview</title>
    <style>
      body {
        margin: 0;
        padding: 2rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f1f5f9;
      }
      .notifications-panel {
        max-width: 720px;
        margin: 0 auto;
        background: #fff;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
      }
      h2 {
        margin-top: 0;
      }
      .filters {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .filters button {
        border-radius: 999px;
        border: 1px solid #cbd5f5;
        padding: 0.35rem 1rem;
        background: #fff;
      }
      .filters button[aria-pressed="true"] {
        background: #0f172a;
        color: #fff;
      }
      .filters button:focus {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      li[data-status="unread"] {
        border-left: 4px solid #2563eb;
      }
      li {
        background: #f8fafc;
        margin-bottom: 0.75rem;
        border-radius: 0.75rem;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
      }
      .content {
        flex: 1;
      }
      .actions button {
        background: none;
        border: none;
        color: #2563eb;
        cursor: pointer;
      }
      .actions button:focus {
        outline: 3px solid #2563eb;
        outline-offset: 2px;
      }
    </style>
  </head>
  <body>
    <section id="notifications-root" aria-label="Guardian notifications center">
      <div class="notifications-panel">
        <header>
          <h2>Notifications</h2>
          <p id="notification-summary">2 unread alerts</p>
        </header>
        <div class="filters" role="group" aria-label="Notification filters">
          <button type="button" data-filter="all" aria-pressed="true">All</button>
          <button type="button" data-filter="unread" aria-pressed="false">Unread</button>
          <button type="button" data-filter="system" aria-pressed="false">System</button>
        </div>
        <ul role="list">
          <li data-testid="notification-item" data-category="system" data-status="unread">
            <article class="content" aria-live="polite">
              <h3>Escrow released</h3>
              <p>৳5,200 released to caregiver Nasima Akter.</p>
            </article>
            <div class="actions">
              <button type="button" data-mark-read>Mark as read</button>
            </div>
          </li>
          <li data-testid="notification-item" data-category="general" data-status="unread">
            <article class="content">
              <h3>Care log pending review</h3>
              <p>Review the vitals logged for patient Rahim Uddin today.</p>
            </article>
            <div class="actions">
              <button type="button" data-mark-read>Mark as read</button>
            </div>
          </li>
          <li data-testid="notification-item" data-category="system" data-status="read">
            <article class="content">
              <h3>Compliance reminder</h3>
              <p>Upload the caregiver verification slip before 30 Nov.</p>
            </article>
            <span aria-label="Read notification" role="status">Read</span>
          </li>
        </ul>
      </div>
    </section>
    <script>
      (() => {
        const summary = document.getElementById('notification-summary');
        const items = Array.from(document.querySelectorAll('[data-testid="notification-item"]'));
        const filters = document.querySelectorAll('[data-filter]');

        const updateSummary = () => {
          const unreadCount = items.filter((item) => item.dataset.status === 'unread').length;
          summary.textContent = unreadCount + ' unread ' + (unreadCount === 1 ? 'alert' : 'alerts');
        };

        const applyFilter = (type) => {
          items.forEach((item) => {
            const isVisible =
              type === 'all' ||
              (type === 'unread' && item.dataset.status === 'unread') ||
              (type === 'system' && item.dataset.category === 'system');
            item.style.display = isVisible ? 'flex' : 'none';
          });
        };

        filters.forEach((button) => {
          button.addEventListener('click', () => {
            filters.forEach((peer) => peer.setAttribute('aria-pressed', 'false'));
            button.setAttribute('aria-pressed', 'true');
            applyFilter(button.dataset.filter);
          });
        });

        document.querySelectorAll('[data-mark-read]').forEach((control) => {
          control.addEventListener('click', () => {
            const host = control.closest('[data-testid="notification-item"]');
            host.dataset.status = 'read';
            host.removeAttribute('data-status');
            host.style.borderLeft = '4px solid transparent';
            control.remove();
            updateSummary();
          });
        });

        updateSummary();
      })();
    </script>
  </body>
</html>`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scanForViolations = async (page: any, selector?: string) => {
  const builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag21aa']);
  if (selector) {
    builder.include(selector);
  }
  const results = await builder.analyze();
  expect(results.violations, results.violations.map((v) => v.id).join(', ')).toEqual([]);
};

test.describe('Guardian dashboard preview (Playwright + axe)', () => {
  test('quick actions maintain keyboard order and modal trap', async ({ page }) => {
    await page.setContent(guardianQuickActionsMarkup, { waitUntil: 'load' });
    await scanForViolations(page, '#root');

    const addPatient = page.getByRole('button', { name: 'Add Patient' });
    await addPatient.focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Create Job' })).toBeFocused();

    await addPatient.click();
    const dialog = page.getByRole('dialog', { name: 'Add Patient' });
    await expect(dialog).toBeVisible();

    await scanForViolations(page, '#modal-dialog');

    const nameInput = page.getByLabel('Patient Name');
    await expect(nameInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Save' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Close modal' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(nameInput).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(addPatient).toBeFocused();
  });

  test('dispute table exposes sortable headers and remains accessible', async ({ page }) => {
    await page.setContent(guardianDisputeTableMarkup, { waitUntil: 'load' });
    await scanForViolations(page, '#table-root');

    const caseSort = page.getByRole('button', { name: /case id/i });
    const amountSort = page.getByRole('button', { name: /amount/i });
    await caseSort.focus();
    await expect(caseSort).toBeFocused();

    const firstRowBefore = await page.locator('tbody tr').first().textContent();
    await amountSort.click();
    const firstRowAfter = await page.locator('tbody tr').first().textContent();
    expect(firstRowBefore).not.toEqual(firstRowAfter);

    await scanForViolations(page, '#table-root');
  });

  test('payment history tabs expose accessible filters and tables', async ({ page }) => {
    await page.setContent(guardianPaymentHistoryMarkup, { waitUntil: 'load' });
    await scanForViolations(page, '#payments-root');

    const allTab = page.getByRole('tab', { name: /all transactions/i });
    const upcomingTab = page.getByRole('tab', { name: /upcoming payouts/i });
    const completedTab = page.getByRole('tab', { name: /completed payouts/i });

    await allTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(upcomingTab).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(upcomingTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', { name: /upcoming payouts/i })).toBeVisible();
    await expect(page.getByRole('tabpanel', { name: /all transactions/i })).toBeHidden();

    const firstUpcomingRow = page.getByTestId('upcoming-row').first();
    await expect(firstUpcomingRow).toContainText('Nasima Akter');

    await page.keyboard.press('End');
    await expect(completedTab).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('tabpanel', { name: /completed payouts/i })).toBeVisible();

    await scanForViolations(page, '#payments-root');
  });

  test('notifications center filters unread/system alerts without axe violations', async ({ page }) => {
    await page.setContent(guardianNotificationsMarkup, { waitUntil: 'load' });
    await scanForViolations(page, '#notifications-root');

    const filterGroup = page.getByRole('group', { name: /notification filters/i });
    await expect(filterGroup).toBeVisible();

    const unreadFilter = page.getByRole('button', { name: /unread/i });
    await unreadFilter.focus();
    await page.keyboard.press('Enter');
    await expect(unreadFilter).toHaveAttribute('aria-pressed', 'true');

    const visibleUnread = await page.locator('[data-testid="notification-item"]:visible').count();
    expect(visibleUnread).toBe(2);

    const markReadButton = page.getByRole('button', { name: /mark as read/i }).first();
    await markReadButton.click();
    await expect(page.getByText(/1 unread alert/i)).toBeVisible();

    const systemFilter = page.getByRole('button', { name: /system/i });
    await systemFilter.click();
    const systemVisible = await page.locator('[data-testid="notification-item"]:visible').count();
    expect(systemVisible).toBe(2);

    await scanForViolations(page, '#notifications-root');
  });
});
