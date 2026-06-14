import Image from "next/image";
import Link from "next/link";

import { projects } from "@data/projects";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-3xl bg-white p-10 shadow-lg shadow-slate-200/30">
          <h1 className="text-4xl font-semibold">Projects</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Explore validated portfolio work built with a schema-driven content model. Each project card
            includes timeline, tech stack, status, and media details.
          </p>
        </header>

        <div className="space-y-10">
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-200/30"
            >
              <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
                <div className="relative h-80 overflow-hidden bg-slate-100 lg:h-auto">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority={false}
                  />
                </div>

                <div className="p-10">
                  <div className="flex flex-wrap items-start gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      {project.category}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      {project.status}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                      {project.timeline}
                    </span>
                  </div>

                  <h2 className="mt-6 text-3xl font-semibold text-slate-900">{project.title}</h2>
                  <p className="mt-4 text-slate-600">{project.shortDescription}</p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Role
                      </h3>
                      <p className="mt-2 text-slate-700">{project.role}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Team size
                      </h3>
                      <p className="mt-2 text-slate-700">{project.teamSize}</p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-slate-700">Tech stack</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-slate-100 px-3 py-1 text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Tags</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-3 py-1 text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href={`/apps/projects/${project.slug}`}
                      className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                      View details
                    </Link>
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                      >
                        GitHub
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-slate-50 px-10 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Features
                    </h3>
                    <ul className="mt-4 space-y-2 text-slate-700">
                      {project.features.length > 0 ? (
                        project.features.map((feature) => <li key={feature}>• {feature}</li>)
                      ) : (
                        <li>Not yet specified.</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Challenges
                    </h3>
                    <ul className="mt-4 space-y-2 text-slate-700">
                      {project.challenges.length > 0 ? (
                        project.challenges.map((challenge) => <li key={challenge}>• {challenge}</li>)
                      ) : (
                        <li>Not yet specified.</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Results
                    </h3>
                    <ul className="mt-4 space-y-2 text-slate-700">
                      {project.results.length > 0 ? (
                        project.results.map((result) => <li key={result}>• {result}</li>)
                      ) : (
                        <li>Not yet specified.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
