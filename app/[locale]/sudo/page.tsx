/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { changeUserRole, createDevSudo } from "@/actions/sudo";

export default async function SudoDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [tenants, users, totalTransactions] = await Promise.all([
    prisma.tenant.findMany({ include: { users: true, warehouses: true } }),
    prisma.user.findMany({ include: { tenant: true }, orderBy: { createdAt: "desc" } }),
    prisma.transactionLedger.count(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="neu-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-bold font-mono">
              ROOT_LEVEL
            </span>
            <h2 className="text-2xl font-bold bg-neu-accent-gradient bg-clip-text text-transparent">
              {locale === "ur-PK" ? "سوڈو کنٹرول پینل" : "Sudo Super-Admin Central"}
            </h2>
          </div>
          <p className="text-neu-muted text-xs sm:text-sm mt-1">
            Global multi-tenant governance, schema instances, and user elevation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="neu-card p-5">
          <span className="text-xs text-neu-muted">Active Tenant Hubs</span>
          <p className="text-2xl font-bold text-neu-text mt-1">{tenants.length}</p>
        </div>
        <div className="neu-card p-5">
          <span className="text-xs text-neu-muted">Total Platform Users</span>
          <p className="text-2xl font-bold text-neu-accent mt-1">{users.length}</p>
        </div>
        <div className="neu-card p-5">
          <span className="text-xs text-neu-muted">Immutable Ledger Entries</span>
          <p className="text-2xl font-bold text-green-400 mt-1">{totalTransactions}</p>
        </div>
      </div>
      <div className="neu-card p-6">
        <h3 className="text-base font-semibold text-neu-text mb-4">User Authority Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-neu-light/20 text-neu-muted">
                <th className="pb-3 text-start">User</th>
                <th className="pb-3 text-start">Phone</th>
                <th className="pb-3 text-start">Tenant</th>
                <th className="pb-3 text-start">Role</th>
                <th className="pb-3 text-end">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neu-light/10">
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-neu-pressed/40 transition">
                  <td className="py-3 font-semibold text-neu-text">{u.fullName}</td>
                  <td className="py-3 text-neu-muted font-mono">{u.phone}</td>
                  <td className="py-3 text-neu-muted">{u.tenant?.name || "Shah Alami Hub"}</td>
                  <td className="py-3">
                    <form action={changeUserRole} className="flex items-center gap-2 justify-end">
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <select name="newRole" defaultValue={u.role} className="neu-input text-sm">
                        <option value="SUDO">Super Admin</option>
                        <option value="ADMIN">Admin</option>
                        <option value="DISTRIBUTOR">Distributor</option>
                        <option value="INVESTOR">Investor</option>
                        <option value="SOURCING_AGENT">Sourcing Agent</option>
                        <option value="SELLER">Seller</option>
                      </select>
                      <button type="submit" className="neu-btn text-sm">Change</button>
                    </form>
                  </td>
                  <td className="py-3 text-end">
                    <span className={`font-semibold ${u.isActive ? "text-green-400" : "text-rose-500"}`}>
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="neu-card p-6">
        <h4 className="font-semibold text-neu-text mb-3">Dev helpers</h4>
        <p className="text-xs text-neu-muted mb-3">Create or upsert a development `SUDO` user (disabled in production).</p>
        <form action={createDevSudo} className="flex gap-2 flex-wrap">
          <input name="phone" placeholder="phone" defaultValue="03057851808" className="neu-input text-sm" />
          <input name="password" placeholder="password" defaultValue="Lukilion9211" className="neu-input text-sm" />
          <input name="fullName" placeholder="Full name" defaultValue="Dev Sudo" className="neu-input text-sm" />
          <button type="submit" className="neu-btn text-sm">Create Dev Sudo</button>
        </form>
      </div>

      {/* Sudo Capability Sections (UI-only placeholders; actions require secure backend & approvals) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="neu-card p-6">
          <h4 className="font-semibold text-neu-text mb-3">Identity, Access & Role Governance (IAM)</h4>
          <ul className="text-sm text-neu-muted list-disc list-inside mb-4">
            <li>Create, suspend, invite, or permanently delete users across all tiers and departments.</li>
            <li>Define and modify RBAC / ABAC permission matrices.</li>
            <li>Enforce MFA/SSO, session timeouts, password complexity, IP whitelisting.</li>
            <li>Impersonate users (audit-logged).</li>
          </ul>
          <div className="flex gap-2">
            <button disabled className="neu-btn text-sm" title="Requires secure backend and audit approvals">Manage Users</button>
            <button disabled className="neu-btn text-sm" title="Requires secure backend and audit approvals">Modify Roles</button>
            <button disabled className="neu-btn text-sm" title="Requires secure backend and audit approvals">Impersonate</button>
          </div>
          <p className="text-xs text-neu-muted mt-3">Note: These controls are UI placeholders. Enabling them requires secure server-side workflows, audit logging, and explicit operator approval.</p>
        </div>

        <div className="neu-card p-6">
          <h4 className="font-semibold text-neu-text mb-3">Financial, Billing & Subscription Control</h4>
          <ul className="text-sm text-neu-muted list-disc list-inside mb-4">
            <li>View/update/cancel licensing tiers, add-ons, payment methods.</li>
            <li>Access ledgers, override invoice disputes, approve fiscal credits.</li>
            <li>Set spending caps and departmental budgets.</li>
          </ul>
          <div className="flex gap-2">
            <button disabled className="neu-btn text-sm">Billing Console</button>
            <button disabled className="neu-btn text-sm">Adjust Ledgers</button>
          </div>
          <p className="text-xs text-neu-muted mt-3">Note: Financial actions require multi-factor approvals and audit trails; backend hooks must enforce approvals.</p>
        </div>

        <div className="neu-card p-6">
          <h4 className="font-semibold text-neu-text mb-3">Data Governance & System Configuration</h4>
          <ul className="text-sm text-neu-muted list-disc list-inside mb-4">
            <li>Configure time zones, currencies, localization, branding.</li>
            <li>Data exports, schema modifications, rollbacks, and purges.</li>
            <li>Manage workflows, webhooks, and API connector keys.</li>
          </ul>
          <div className="flex gap-2">
            <button disabled className="neu-btn text-sm">Export Data</button>
            <button disabled className="neu-btn text-sm">Schema / Rollback</button>
            <button disabled className="neu-btn text-sm">Webhooks</button>
          </div>
          <p className="text-xs text-neu-muted mt-3">Caution: Schema & purge operations are destructive. These buttons are placeholders only.</p>
        </div>

        <div className="neu-card p-6">
          <h4 className="font-semibold text-neu-text mb-3">Compliance, Security & Audit Logs</h4>
          <ul className="text-sm text-neu-muted list-disc list-inside mb-4">
            <li>Immutable audit trails for logins, data changes, permission escalations.</li>
            <li>Generate GDPR/HIPAA/SOC2/ISO reports and manage retention policies.</li>
            <li>Manage KMS and backup schedules.</li>
          </ul>
          <div className="flex gap-2">
            <button disabled className="neu-btn text-sm">View Audit Logs</button>
            <button disabled className="neu-btn text-sm">Export Compliance Report</button>
          </div>
          <p className="text-xs text-neu-muted mt-3">Note: Access to logs and key management requires strict access controls and key handling outside the webapp UI.</p>
        </div>

        <div className="neu-card p-6 lg:col-span-2">
          <h4 className="font-semibold text-neu-text mb-3">Operating System Level Controls (PROHIBITED via web UI)</h4>
          <p className="text-sm text-neu-muted mb-3">The app will never expose direct OS-level operations (like editing /etc/passwd, running systemctl, mounting disks, changing iptables, or rebooting machines) through the web interface. Those operations must be performed by authorized ops personnel via secure channels and audited runbooks.</p>
          <ul className="text-sm text-neu-muted list-disc list-inside">
            <li>For server-level management, use SSH with key-based access and guardrails (bastion hosts, jump boxes).</li>
            <li>Implement automation through CI/CD pipelines, IaC tools (Terraform/Ansible), and signed runbooks rather than arbitrary web triggers.</li>
            <li>Provide a secure &apos;playbook request&apos; mechanism here that creates an auditable ticket for ops teams to execute in a controlled environment.</li>
          </ul>
          <div className="mt-4">
            <button className="neu-btn text-sm" disabled title="Use audited runbooks and ops channels">Create Ops Runbook Request</button>
          </div>
        </div>
      </div>
    </div>
  );
}
